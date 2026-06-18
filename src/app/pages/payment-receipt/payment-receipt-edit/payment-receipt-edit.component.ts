import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PaymentReceiptService } from '../../../services/paymentreceipt.service';
import { OrderService } from '../../../services/order.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { PaymentReceipt } from '../../../model/paymentreceipt';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-payment-receipt-edit',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, RouterLink, MatSelectModule],
  templateUrl: './payment-receipt-edit.component.html',
  styleUrl: './payment-receipt-edit.component.css',
})
export class PaymentReceiptEditComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(PaymentReceiptService);
  protected readonly orderService = inject(OrderService);

  protected $form = signal(new FormGroup({
    idReceipt: new FormControl<number | null>(null),
    order: new FormControl<any>(null, [Validators.required]),
    receiptType: new FormControl<string>('', [Validators.required]),
    receiptNumber: new FormControl<string>('', [Validators.required]),
    series: new FormControl<string>('', [Validators.required]),
    emissionDate: new FormControl<string>('', [Validators.required]),
    subTotal: new FormControl<number | null>(null, [Validators.required]),
    igv: new FormControl<number | null>(null, [Validators.required]),
    totalAmount: new FormControl<number | null>(null, [Validators.required]),
    status: new FormControl<string>('EMITIDO', [Validators.required]),
    paymentMethod: new FormControl<string>('', [Validators.required]),
    businessName: new FormControl<string>(''),
    ruc: new FormControl<string>(''),
    fiscalAddress: new FormControl<string>(''),
  }));

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id());

  constructor() {
    this.orderService.findAll().subscribe(data => this.orderService.setListChange(data));
    effect(() => {
      const id = this.$id();
      if (id) this.service.findById(id).subscribe(data => this.$form().patchValue(data));
    });
  }

  compareFnOrder(a: any, b: any): boolean {
    return a && b ? a.idOrder === b.idOrder : a === b;
  }

  operate() {
    if (this.$form().invalid) return;
    const isEdit = this.$isEdit();
    const id = this.$id();
    const item: PaymentReceipt = this.$form().value as unknown as PaymentReceipt;
    const op$ = isEdit ? this.service.update(id, item) : this.service.save(item);
    op$.pipe(
      switchMap(() => this.service.findAll()),
      tap(data => this.service.setListChange(data)),
      tap(() => this.service.setMessageChange(isEdit ? 'UPDATED' : 'CREATED'))
    ).subscribe(() => this.router.navigate(['/pages/payment-receipt']));
  }
}
