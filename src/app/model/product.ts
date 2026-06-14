import { ProductCategory } from './productcategory';

export interface Product {
  idProduct?: number;
  name: string;
  description?: string;
  preparationTime: number;
  price: number;
  availability: boolean;
  category: ProductCategory;
}