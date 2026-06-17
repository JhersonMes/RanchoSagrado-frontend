import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { GenericSignalService } from './generic-signal.service';
import { IngredientCategory } from '../model/ingredientcategory';

@Injectable({ providedIn: 'root' })
export class IngredientCategoryService extends GenericSignalService<IngredientCategory> {
  protected override url: string = `${environment.HOST}/ingredient-categories`;
}