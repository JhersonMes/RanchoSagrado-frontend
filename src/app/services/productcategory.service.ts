import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { GenericSignalService } from './generic-signal.service';
import { ProductCategory } from '../model/productcategory';

@Injectable({ providedIn: 'root' })
export class ProductCategoryService extends GenericSignalService<ProductCategory> {
  protected override url: string = `${environment.HOST}/product-categories`;
}