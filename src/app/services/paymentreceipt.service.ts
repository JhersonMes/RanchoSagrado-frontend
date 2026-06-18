import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { GenericSignalService } from './generic-signal.service';
import { PaymentReceipt } from '../model/paymentreceipt';

@Injectable({ providedIn: 'root' })
export class PaymentReceiptService extends GenericSignalService<PaymentReceipt> {
  protected override url: string = `${environment.HOST}/payment-receipts`;
}
