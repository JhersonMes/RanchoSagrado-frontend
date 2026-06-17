import { Component, computed, effect, inject, signal } from '@angular/core';
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
import { toSignal } from '@angular/core/rxjs-interop';
import { Order } from '../../../model/order';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-order-edit',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, RouterLink, MatSelectModule],
  templateUrl: './order-edit.component.html',
  styleUrl: './order-edit.component.css',
})
export class OrderEditComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(OrderService);
  protected readonly clientService = inject(ClientService);
  protected readonly employeeService = inject(EmployeeService);
  protected readonly tableService = inject(RestaurantTableService);

  protected $form = signal(new FormGroup({
    idOrder: new FormControl<number | null>(null),
    orderDate: new FormControl<string>('', [Validators.required]),
    status: new FormControl<string>('PENDIENTE', [Validators.required]),
    detail: new FormControl<string>(''),
    subTotal: new FormControl<number | null>(null, [Validators.required]),
    total: new FormControl<number | null>(null, [Validators.required]),
    client: new FormControl<any>(null),
    restaurantTable: new FormControl<any>(null),
    employee: new FormControl<any>(null, [Validators.required]),
  }));

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id());

  constructor() {
    this.clientService.findAll().subscribe(data => this.clientService.setListChange(data));
    this.employeeService.findAll().subscribe(data => this.employeeService.setListChange(data));
    this.tableService.findAll().subscribe(data => this.tableService.setListChange(data));
    effect(() => {
      const id = this.$id();
      if (id) this.service.findById(id).subscribe(data => this.$form().patchValue(data));
    });
  }

  compareFnClient(a: any, b: any): boolean { return a && b ? a.idClient === b.idClient : a === b; }
  compareFnEmployee(a: any, b: any): boolean { return a && b ? a.idEmployee === b.idEmployee : a === b; }
  compareFnTable(a: any, b: any): boolean { return a && b ? a.idTable === b.idTable : a === b; }

  operate() {
    if (this.$form().invalid) return;
    const isEdit = this.$isEdit();
    const id = this.$id();
    const item: Order = this.$form().value as unknown as Order;
    const op$ = isEdit ? this.service.update(id, item) : this.service.save(item);
    op$.pipe(
      switchMap(() => this.service.findAll()),
      tap(data => this.service.setListChange(data)),
      tap(() => this.service.setMessageChange(isEdit ? 'UPDATED' : 'CREATED'))
    ).subscribe(() => this.router.navigate(['/pages/order']));
  }
}
