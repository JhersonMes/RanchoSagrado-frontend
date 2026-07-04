import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { GenericSignalService } from './generic-signal.service';
import { OrderDetail } from '../model/orderdetail';

@Injectable({ providedIn: 'root' })
export class OrderDetailService extends GenericSignalService<OrderDetail> {
  protected override url: string = `${environment.HOST}/order-details`;

  saveBatch(details: OrderDetail[]) {
    return this.http.post<OrderDetail[]>(`${this.url}/batch`, details);
  }
}
