import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { GenericSignalService } from './generic-signal.service';
import { Inventory } from '../model/inventory';

@Injectable({ providedIn: 'root' })
export class InventoryService extends GenericSignalService<Inventory> {
  protected override url: string = `${environment.HOST}/inventories`;
}