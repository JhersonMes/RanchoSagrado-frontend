import { Menu } from './menu';

export interface ProductCategory {
  idProductCategory?: number;
  name: string;
  description?: string;
  menu: Menu;
}