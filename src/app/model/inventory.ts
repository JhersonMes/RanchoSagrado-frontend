import { Ingredient } from './ingredient';

export interface Inventory {
  idInventory?: number;
  stockQuantity: number;
  lastReplenishmentDate: string;   
  minStock: number;
  maxStock: number;
  ingredient: Ingredient;
}