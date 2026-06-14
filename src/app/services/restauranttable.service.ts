import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { GenericSignalService } from './generic-signal.service';
import { RestaurantTable } from '../model/restauranttable';

@Injectable({ providedIn: 'root' })
export class RestaurantTableService extends GenericSignalService<RestaurantTable> {
  protected override url: string = `${environment.HOST}/restaurant-tables`;
}