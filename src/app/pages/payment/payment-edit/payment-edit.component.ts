import { FormHeaderComponent } from '../../../shared/form-header/form-header.component';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PaymentService } from '../../../services/payment.service';
import { OrderService } from '../../../services/order.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Payment } from '../../../model/payment';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-payment-edit',
  imports: [FormHeaderComponent, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, RouterLink, MatSelectModule],
  templateUrl: './payment-edit.component.html',
  styleUrl: './payment-edit.component.css',
})
export class PaymentEditComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(PaymentService);
  protected readonly orderService = inject(OrderService);

  protected $form = signal(new FormGroup({
    idPayment: new FormControl<number | null>(null),
    paymentDate: new FormControl<string>('', [Validators.required]),
    amount: new FormControl<number | null>(null, [Validators.required]),
    paymentMethod: new FormControl<string>('', [Validators.required]),
    cardDetails: new FormControl<string>(''),
    status: new FormControl<string>('PENDIENTE', [Validators.required]),
    order: new FormControl<any>(null, [Validators.required]),
  }));

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  private readonly $queryParams = toSignal(this.route.queryParams, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id());

  protected readonly dateLocked = signal(true);
  protected readonly amountLocked = signal(true);

  constructor() {
    this.orderService.findAll().subscribe(data => this.orderService.setListChange(data));
    effect(() => {
      const id = this.$id();
      if (id) this.service.findById(id).subscribe(data => this.$form().patchValue(data));
    });

    // Precarga el pedido al "Cobrar" desde la lista de pedidos (?orderId=)
    effect(() => {
      const orderId = Number(this.$queryParams()['orderId']);
      const orders = this.orderService.$listChange();
      if (!this.$isEdit() && orderId && orders.length) {
        const order = orders.find((o) => o.idOrder === orderId);
        if (order) {
          this.$form().patchValue({ order, amount: order.total });
        }
      }
    });

    if (!this.$isEdit()) {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      this.$form().patchValue({ paymentDate: now.toISOString().slice(0, 16) });
    }
    this.$form().controls.paymentDate.disable();
    this.$form().controls.amount.disable();
  }

  toggleDateLock(): void {
    this.dateLocked.set(!this.dateLocked());
    this.dateLocked() ? this.$form().controls.paymentDate.disable() : this.$form().controls.paymentDate.enable();
  }

  toggleAmountLock(): void {
    this.amountLocked.set(!this.amountLocked());
    this.amountLocked() ? this.$form().controls.amount.disable() : this.$form().controls.amount.enable();
  }

  compareFnOrder(a: any, b: any): boolean {
    return a && b ? a.idOrder === b.idOrder : a === b;
  }

  operate() {
    if (this.$form().invalid) return;
    const isEdit = this.$isEdit();
    const id = this.$id();
    const item: Payment = this.$form().getRawValue() as unknown as Payment;
    const op$ = isEdit ? this.service.update(id, item) : this.service.save(item);
    op$.pipe(
      switchMap(() => this.service.findAll()),
      tap(data => this.service.setListChange(data)),
      tap(() => this.service.setMessageChange(isEdit ? 'UPDATED' : 'CREATED'))
    ).subscribe(() => this.router.navigate(['/pages/payment']));
  }
}
