import { Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { RoleService } from '../../services/rol.service';
import { UserService } from '../../services/user.service';
import { EmployeeService } from '../../services/employee.service';
import { ShiftService } from '../../services/shift.service';
import { ContractService } from '../../services/contract.service';
import { ClientService } from '../../services/client.service';
import { RestaurantTableService } from '../../services/restauranttable.service';
import { ReservationService } from '../../services/reservation.service';
import { MenuService } from '../../services/menu.service';
import { ProductCategoryService } from '../../services/productcategory.service';
import { ProductService } from '../../services/product.service';
import { IngredientCategoryService } from '../../services/ingredientcategory.service';
import { IngredientService } from '../../services/ingredient.service';
import { InventoryService } from '../../services/inventory.service';
import { PromotionService } from '../../services/promotion.service';
import { OrderService } from '../../services/order.service';
import { PaymentService } from '../../services/payment.service';
import { PaymentReceiptService } from '../../services/paymentreceipt.service';
import { SupplierService } from '../../services/supplier.service';

type EntityKey =
  | 'role'
  | 'user'
  | 'employee'
  | 'shift'
  | 'contract'
  | 'client'
  | 'restaurantTable'
  | 'reservation'
  | 'menu'
  | 'productCategory'
  | 'product'
  | 'ingredientCategory'
  | 'ingredient'
  | 'inventory'
  | 'promotion'
  | 'order'
  | 'payment'
  | 'paymentReceipt'
  | 'supplier';

interface BusinessCard {
  title: string;
  subtitle: string;
  icon: string;
  link: string;
  entity: EntityKey;
  requires?: { entity: EntityKey; label: string }[];
}

interface BusinessSection {
  title: string;
  cards: BusinessCard[];
}

@Component({
  selector: 'app-business',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  templateUrl: './business.component.html',
  styleUrl: './business.component.css',
})
export class BusinessComponent {
  private readonly roleService = inject(RoleService);
  private readonly userService = inject(UserService);
  private readonly employeeService = inject(EmployeeService);
  private readonly shiftService = inject(ShiftService);
  private readonly contractService = inject(ContractService);
  private readonly clientService = inject(ClientService);
  private readonly tableService = inject(RestaurantTableService);
  private readonly reservationService = inject(ReservationService);
  private readonly menuService = inject(MenuService);
  private readonly productCategoryService = inject(ProductCategoryService);
  private readonly productService = inject(ProductService);
  private readonly ingredientCategoryService = inject(IngredientCategoryService);
  private readonly ingredientService = inject(IngredientService);
  private readonly inventoryService = inject(InventoryService);
  private readonly promotionService = inject(PromotionService);
  private readonly orderService = inject(OrderService);
  private readonly paymentService = inject(PaymentService);
  private readonly paymentReceiptService = inject(PaymentReceiptService);
  private readonly supplierService = inject(SupplierService);

  private readonly entityCounts = computed<Record<EntityKey, number>>(() => ({
    role: this.roleService.$listChange().length,
    user: this.userService.$listChange().length,
    employee: this.employeeService.$listChange().length,
    shift: this.shiftService.$listChange().length,
    contract: this.contractService.$listChange().length,
    client: this.clientService.$listChange().length,
    restaurantTable: this.tableService.$listChange().length,
    reservation: this.reservationService.$listChange().length,
    menu: this.menuService.$listChange().length,
    productCategory: this.productCategoryService.$listChange().length,
    product: this.productService.$listChange().length,
    ingredientCategory: this.ingredientCategoryService.$listChange().length,
    ingredient: this.ingredientService.$listChange().length,
    inventory: this.inventoryService.$listChange().length,
    promotion: this.promotionService.$listChange().length,
    order: this.orderService.$listChange().length,
    payment: this.paymentService.$listChange().length,
    paymentReceipt: this.paymentReceiptService.$listChange().length,
    supplier: this.supplierService.$listChange().length,
  }));

  protected readonly sections: BusinessSection[] = [
    {
      title: 'Personal',
      cards: [
        {
          title: 'Roles',
          subtitle: 'Ver y administrar registros',
          icon: 'shield',
          link: '/pages/role',
          entity: 'role',
        },
        {
          title: 'Usuarios',
          subtitle: 'Ver y administrar registros',
          icon: 'group',
          link: '/pages/user',
          entity: 'user',
          requires: [
            { entity: 'role', label: 'un Rol' },
            { entity: 'employee', label: 'un Empleado' },
          ],
        },
        {
          title: 'Empleados',
          subtitle: 'Ver y administrar registros',
          icon: 'badge',
          link: '/pages/employee',
          entity: 'employee',
        },
        {
          title: 'Turnos',
          subtitle: 'Ver y administrar registros',
          icon: 'schedule',
          link: '/pages/shift',
          entity: 'shift',
        },
        {
          title: 'Contratos',
          subtitle: 'Ver y administrar registros',
          icon: 'description',
          link: '/pages/contract',
          entity: 'contract',
          requires: [{ entity: 'employee', label: 'un Empleado' }],
        },
      ],
    },
    {
      title: 'Clientes y Mesas',
      cards: [
        {
          title: 'Clientes',
          subtitle: 'Ver y administrar registros',
          icon: 'person',
          link: '/pages/client',
          entity: 'client',
        },
        {
          title: 'Mesas',
          subtitle: 'Ver y administrar registros',
          icon: 'table_restaurant',
          link: '/pages/restaurant-table',
          entity: 'restaurantTable',
        },
        {
          title: 'Reservaciones',
          subtitle: 'Ver y administrar registros',
          icon: 'event',
          link: '/pages/reservation',
          entity: 'reservation',
          requires: [
            { entity: 'client', label: 'un Cliente' },
            { entity: 'restaurantTable', label: 'una Mesa' },
          ],
        },
      ],
    },
    {
      title: 'Menú e Inventario',
      cards: [
        {
          title: 'Cartas',
          subtitle: 'Ver y administrar registros',
          icon: 'menu_book',
          link: '/pages/menu',
          entity: 'menu',
        },
        {
          title: 'Categorías de Producto',
          subtitle: 'Ver y administrar registros',
          icon: 'category',
          link: '/pages/product-category',
          entity: 'productCategory',
        },
        {
          title: 'Productos',
          subtitle: 'Ver y administrar registros',
          icon: 'restaurant',
          link: '/pages/product',
          entity: 'product',
          requires: [{ entity: 'productCategory', label: 'una Categoría de Producto' }],
        },
        {
          title: 'Categorías de Ingrediente',
          subtitle: 'Ver y administrar registros',
          icon: 'kitchen',
          link: '/pages/ingredient-category',
          entity: 'ingredientCategory',
        },
        {
          title: 'Ingredientes',
          subtitle: 'Ver y administrar registros',
          icon: 'water_drop',
          link: '/pages/ingredient',
          entity: 'ingredient',
          requires: [{ entity: 'ingredientCategory', label: 'una Categoría de Ingrediente' }],
        },
        {
          title: 'Inventario',
          subtitle: 'Ver y administrar registros',
          icon: 'inventory_2',
          link: '/pages/inventory',
          entity: 'inventory',
          requires: [{ entity: 'ingredient', label: 'un Ingrediente' }],
        },
        {
          title: 'Promociones',
          subtitle: 'Ver y administrar registros',
          icon: 'sell',
          link: '/pages/promotion',
          entity: 'promotion',
          requires: [{ entity: 'product', label: 'un Producto' }],
        },
      ],
    },
    {
      title: 'Ventas',
      cards: [
        {
          title: 'Pedidos',
          subtitle: 'Ver y administrar registros',
          icon: 'receipt_long',
          link: '/pages/order',
          entity: 'order',
          requires: [
            { entity: 'employee', label: 'un Empleado' },
            { entity: 'product', label: 'un Producto' },
          ],
        },
        {
          title: 'Pagos',
          subtitle: 'Ver y administrar registros',
          icon: 'payments',
          link: '/pages/payment',
          entity: 'payment',
          requires: [{ entity: 'order', label: 'un Pedido' }],
        },
        {
          title: 'Comprobantes de Pago',
          subtitle: 'Ver y administrar registros',
          icon: 'receipt',
          link: '/pages/payment-receipt',
          entity: 'paymentReceipt',
          requires: [{ entity: 'order', label: 'un Pedido' }],
        },
      ],
    },
    {
      title: 'Proveedores',
      cards: [
        {
          title: 'Proveedores',
          subtitle: 'Ver y administrar registros',
          icon: 'local_shipping',
          link: '/pages/supplier',
          entity: 'supplier',
        },
      ],
    },
  ];

  constructor() {
    this.roleService.findAll().subscribe((data) => this.roleService.setListChange(data));
    this.userService.findAll().subscribe((data) => this.userService.setListChange(data));
    this.employeeService.findAll().subscribe((data) => this.employeeService.setListChange(data));
    this.shiftService.findAll().subscribe((data) => this.shiftService.setListChange(data));
    this.contractService.findAll().subscribe((data) => this.contractService.setListChange(data));
    this.clientService.findAll().subscribe((data) => this.clientService.setListChange(data));
    this.tableService.findAll().subscribe((data) => this.tableService.setListChange(data));
    this.reservationService
      .findAll()
      .subscribe((data) => this.reservationService.setListChange(data));
    this.menuService.findAll().subscribe((data) => this.menuService.setListChange(data));
    this.productCategoryService
      .findAll()
      .subscribe((data) => this.productCategoryService.setListChange(data));
    this.productService.findAll().subscribe((data) => this.productService.setListChange(data));
    this.ingredientCategoryService
      .findAll()
      .subscribe((data) => this.ingredientCategoryService.setListChange(data));
    this.ingredientService
      .findAll()
      .subscribe((data) => this.ingredientService.setListChange(data));
    this.inventoryService.findAll().subscribe((data) => this.inventoryService.setListChange(data));
    this.promotionService.findAll().subscribe((data) => this.promotionService.setListChange(data));
    this.orderService.findAll().subscribe((data) => this.orderService.setListChange(data));
    this.paymentService.findAll().subscribe((data) => this.paymentService.setListChange(data));
    this.paymentReceiptService
      .findAll()
      .subscribe((data) => this.paymentReceiptService.setListChange(data));
    this.supplierService.findAll().subscribe((data) => this.supplierService.setListChange(data));
  }

  isLocked(card: BusinessCard): boolean {
    if (!card.requires?.length) return false;
    const counts = this.entityCounts();
    return card.requires.some((req) => counts[req.entity] === 0);
  }

  lockMessage(card: BusinessCard): string {
    const counts = this.entityCounts();
    const missing = card.requires?.filter((req) => counts[req.entity] === 0) ?? [];
    if (!missing.length) return '';
    return `Necesitas crear ${missing.map((m) => m.label).join(' y ')} antes.`;
  }
}
