import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { GenericSignalService } from './generic-signal.service';
import { Payment } from '../model/payment';

@Injectable({ providedIn: 'root' })
export class PaymentService extends GenericSignalService<Payment> {
  protected override url: string = `${environment.HOST}/payments`;
}