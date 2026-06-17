import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { GenericSignalService } from './generic-signal.service';
import { Ingredient } from '../model/ingredient';

@Injectable({ providedIn: 'root' })
export class IngredientService extends GenericSignalService<Ingredient> {
  protected override url: string = `${environment.HOST}/ingredients`;
}