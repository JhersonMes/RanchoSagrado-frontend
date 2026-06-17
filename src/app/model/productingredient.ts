import { Product } from './product';
import { Ingredient } from './ingredient';

export interface ProductIngredient {
  idProductIngredient?: number;
  product: Product;
  ingredient: Ingredient;
  quantity: number;
  unitOfMeasure: string;
  observations?: string;
}