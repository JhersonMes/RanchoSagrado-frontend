import { Component, computed, effect, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormHeaderComponent } from '../../../shared/form-header/form-header.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { ClientService } from '../../../services/client.service';
import { EmployeeService } from '../../../services/employee.service';
import { RestaurantTableService } from '../../../services/restauranttable.service';
import { ProductService } from '../../../services/product.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Order } from '../../../model/order';
import { OrderDetail } from '../../../model/orderdetail';
import { Product } from '../../../model/product';
import { OrderDetailService } from '../../../services/orderdetail.service';
import { catchError, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

interface SelectedProduct {
  idOrderDetail?: number;
  product: Product;
  quantity: number;
}

const IGV_RATE = 0.18;

export const ORDER_STATUSES = [
  'PENDIENTE',
  'EN_PROCESO',
  'LISTO',
  'ENTREGADO',
  'PAGADO',
  'CANCELADO',
] as const;

@Component({
  selector: 'app-order-edit',
  imports: [
    FormHeaderComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatSelectModule,
    DecimalPipe,
  ],
  templateUrl: './order-edit.component.html',
  styleUrl: './order-edit.component.css',
})
export class OrderEditComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(OrderService);
  private readonly orderDetailService = inject(OrderDetailService);
  protected readonly statuses = ORDER_STATUSES;
  protected readonly clientService = inject(ClientService);
  protected readonly employeeService = inject(EmployeeService);
  protected readonly tableService = inject(RestaurantTableService);
  protected readonly productService = inject(ProductService);
  private readonly authService = inject(AuthService);

  protected $form = signal(
    new FormGroup({
      idOrder: new FormControl<number | null>(null),
      orderDate: new FormControl<string>('', [Validators.required]),
      status: new FormControl<string>('PENDIENTE', [Validators.required]),
      detail: new FormControl<string>(''),
      subTotal: new FormControl<number | null>(null, [Validators.required]),
      total: new FormControl<number | null>(null, [Validators.required]),
      client: new FormControl<any>(null),
      restaurantTable: new FormControl<any>(null),
      employee: new FormControl<any>(null, [Validators.required]),
    }),
  );

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id());

  protected readonly dateLocked = signal(true);
  protected readonly subTotalLocked = signal(true);
  protected readonly totalLocked = signal(true);

  protected readonly showProductModal = signal(false);
  protected readonly productSearch = signal('');
  protected readonly selectedProducts = signal<SelectedProduct[]>([]);

  protected readonly productsByCategory = computed(() => {
    const term = this.productSearch().trim().toLowerCase();
    const products = this.productService
      .$listChange()
      .filter((p) => !term || p.name.toLowerCase().includes(term));
    const groups = new Map<string, Product[]>();
    for (const p of products) {
      const categoryName = p.category?.name ?? 'Otros';
      if (!groups.has(categoryName)) groups.set(categoryName, []);
      groups.get(categoryName)!.push(p);
    }
    return Array.from(groups.entries()).map(([name, items]) => ({ name, items }));
  });

  protected readonly subTotalCalc = computed(() =>
    this.selectedProducts().reduce((sum, p) => sum + Number(p.product.price ?? 0) * p.quantity, 0),
  );

  protected readonly igvCalc = computed(() => this.subTotalCalc() * IGV_RATE);

  protected readonly totalCalc = computed(() => this.subTotalCalc() + this.igvCalc());

  protected readonly availableTables = computed(() => {
    const allTables = this.tableService.$listChange();
    const activeOrders = this.service.$listChange().filter(o => o.status !== 'PAGADO' && o.status !== 'CANCELADO');
    const currentOrderId = Number(this.$id());

    return allTables.filter(t => {
      const isOccupied = activeOrders.some(o => o.restaurantTable?.idTable === t.idTable && o.idOrder !== currentOrderId);
      return !isOccupied;
    });
  });

  constructor() {
    const nav = this.router.getCurrentNavigation();
    const preselected: Product | undefined = nav?.extras?.state?.['preselectedProduct'];
    const preselectedTable: any = nav?.extras?.state?.['preselectedTable'];

    this.clientService.findAll().subscribe((data) => this.clientService.setListChange(data));
    this.employeeService.findAll().subscribe((data) => this.employeeService.setListChange(data));
    this.tableService.findAll().subscribe((data) => this.tableService.setListChange(data));
    this.productService.findAll().subscribe((data) => this.productService.setListChange(data));
    this.service.findAll().subscribe((data) => this.service.setListChange(data));
    
    if (this.authService.roleName().toLowerCase().includes('mesero')) {
      this.$form().controls.status.disable();
    }

    // El campo Empleado solo lo puede elegir libremente el Administrador. Para el resto
    // de roles, si la cuenta autenticada tiene un Employee vinculado (ej. el Mesero),
    // se preselecciona y se bloquea. Si no tiene uno vinculado (ej. el Cliente, que no
    // es un empleado), el campo se deja como estaba para no impedir crear el pedido.
    if (!this.authService.roleName().toLowerCase().includes('admin')) {
      this.employeeService.findMine().subscribe({
        next: (employee) => {
          if (!employee) return;
          this.$form().controls.employee.disable();
          if (!this.$isEdit()) {
            this.$form().patchValue({ employee });
          }
        },
        error: () => {},
      });
    }

    effect(() => {
      const id = this.$id();
      if (id) {
        this.service.findById(id).subscribe((data) => this.$form().patchValue(data));
        this.orderDetailService.findAll().subscribe(details => {
           const existing = details.filter(d => d.order.idOrder === Number(id));
           if (existing.length > 0) {
             this.selectedProducts.set(existing.map(d => ({
               product: d.product,
               quantity: d.quantity,
               idOrderDetail: d.idOrderDetail
             })));
           }
        });
      }
    });

    if (!this.$isEdit()) {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      this.$form().patchValue({ orderDate: now.toISOString().slice(0, 16) });
    }
    this.$form().controls.orderDate.disable();
    this.$form().controls.subTotal.disable();
    this.$form().controls.total.disable();

    if (preselected && !this.$isEdit()) {
      this.selectedProducts.set([{ product: preselected, quantity: 1 }]);
      this.$form().patchValue({
        subTotal: Math.round(Number(preselected.price) * 100) / 100,
        total: Math.round(Number(preselected.price) * 1.18 * 100) / 100,
        detail: '1x ' + preselected.name,
      });
    }

    if (preselectedTable && !this.$isEdit()) {
      this.$form().patchValue({ restaurantTable: preselectedTable });
    }
  }

  toggleDateLock(): void {
    this.dateLocked.set(!this.dateLocked());
    this.dateLocked()
      ? this.$form().controls.orderDate.disable()
      : this.$form().controls.orderDate.enable();
  }

  toggleSubTotalLock(): void {
    this.subTotalLocked.set(!this.subTotalLocked());
    this.subTotalLocked()
      ? this.$form().controls.subTotal.disable()
      : this.$form().controls.subTotal.enable();
  }

  toggleTotalLock(): void {
    this.totalLocked.set(!this.totalLocked());
    this.totalLocked()
      ? this.$form().controls.total.disable()
      : this.$form().controls.total.enable();
  }

  compareFnClient(a: any, b: any): boolean {
    return a && b ? a.idClient === b.idClient : a === b;
  }
  compareFnEmployee(a: any, b: any): boolean {
    return a && b ? a.idEmployee === b.idEmployee : a === b;
  }
  compareFnTable(a: any, b: any): boolean {
    return a && b ? a.idTable === b.idTable : a === b;
  }

  openProductModal() {
    this.productSearch.set('');
    this.showProductModal.set(true);
  }

  closeProductModal() {
    this.showProductModal.set(false);
  }

  isProductSelected(product: Product): boolean {
    return this.selectedProducts().some((p) => p.product.idProduct === product.idProduct);
  }

  getQuantity(product: Product): number {
    const found = this.selectedProducts().find((p) => p.product.idProduct === product.idProduct);
    return found ? found.quantity : 0;
  }

  increaseQuantity(product: Product) {
    const current = this.selectedProducts();
    const index = current.findIndex(p => p.product.idProduct === product.idProduct);
    if (index >= 0) {
      const updated = [...current];
      updated[index] = { ...updated[index], quantity: updated[index].quantity + 1 };
      this.selectedProducts.set(updated);
    } else {
      this.selectedProducts.set([...current, { product, quantity: 1 }]);
    }
  }

  decreaseQuantity(product: Product) {
    const current = this.selectedProducts();
    const index = current.findIndex(p => p.product.idProduct === product.idProduct);
    if (index >= 0) {
      const updated = [...current];
      if (updated[index].quantity > 1) {
        updated[index] = { ...updated[index], quantity: updated[index].quantity - 1 };
        this.selectedProducts.set(updated);
      } else {
        this.selectedProducts.set(current.filter(p => p.product.idProduct !== product.idProduct));
      }
    }
  }

  removeProduct(product: Product) {
    this.selectedProducts.set(
      this.selectedProducts().filter((p) => p.product.idProduct !== product.idProduct),
    );
  }

  applySelection() {
    this.$form().patchValue({
      subTotal: Math.round(this.subTotalCalc() * 100) / 100,
      total: Math.round(this.totalCalc() * 100) / 100,
      detail: this.selectedProducts()
        .map((p) => `${p.quantity}x ${p.product.name}`)
        .join(', '),
    });
    this.closeProductModal();
  }

  operate() {
    if (this.$form().invalid) return;
    const isEdit = this.$isEdit();
    const id = this.$id();
    const item: Order = this.$form().getRawValue() as unknown as Order;
    const op$ = isEdit ? this.service.update(id, item) : this.service.save(item);
    op$
      .pipe(
        // Al crear, registra también los detalles (producto, cantidad, precio) vinculados al pedido
        switchMap((created: any) => {
          const idOrder = isEdit ? Number(id) : created?.idOrder;
          if (idOrder && this.selectedProducts().length) {
            const details: OrderDetail[] = this.selectedProducts().map((sp) => ({
              idOrderDetail: sp.idOrderDetail,
              quantity: sp.quantity,
              unitPrice: Number(sp.product.price ?? 0),
              notes: '',
              order: { idOrder },
              product: sp.product,
            }));
            return this.orderDetailService.saveBatch(details).pipe(catchError(() => of(null)));
          }
          return of(null);
        }),
        switchMap(() => this.service.findAll()),
        tap((data) => this.service.setListChange(data)),
        tap(() => this.service.setMessageChange(isEdit ? 'UPDATED' : 'CREATED')),
      )
      .subscribe({
        next: () => this.router.navigate(['/pages/order']),
        error: (err) => window.alert(err?.error?.message ?? 'No se pudo guardar el pedido. Inténtalo de nuevo.'),
      });
  }
}
