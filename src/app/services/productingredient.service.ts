import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { GenericSignalService } from './generic-signal.service';
import { ProductIngredient } from '../model/productingredient';

@Injectable({ providedIn: 'root' })
export class ProductIngredientService extends GenericSignalService<ProductIngredient> {
  protected override url: string = `${environment.HOST}/product-ingredients`;
}