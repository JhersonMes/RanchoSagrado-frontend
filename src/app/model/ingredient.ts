import { IngredientCategory } from './ingredientcategory';

export interface Ingredient {
  idIngredient?: number;
  name: string;
  unitOfMeasure: string;
  description?: string;
  status: boolean;
  unitCost: number;
  ingredientCategory: IngredientCategory;
}