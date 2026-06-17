import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { GenericSignalService } from './generic-signal.service';
import { Order } from '../model/order';

@Injectable({ providedIn: 'root' })
export class OrderService extends GenericSignalService<Order> {
  protected override url: string = `${environment.HOST}/orders`;
}