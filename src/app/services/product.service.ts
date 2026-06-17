import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { GenericSignalService } from './generic-signal.service';
import { Product } from '../model/product';

@Injectable({ providedIn: 'root' })
export class ProductService extends GenericSignalService<Product> {
  protected override url: string = `${environment.HOST}/products`;
}