import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Supplier } from '../model/supplier';
import { HttpClient } from '@angular/common/http';
import { GenericSignalService } from './generic-signal.service';

@Injectable({
  providedIn: 'root',
})
export class SupplierService extends GenericSignalService<Supplier> {
  protected override url: string = `${environment.HOST}/suppliers`;
}