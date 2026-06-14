import { Product } from './product';

export interface Promotion {
  idPromotion?: number;
  name: string;
  description?: string;
  discountPercentage: number;
  startDate: string;  
  endDate: string;
  status: boolean;
  products?: Product[];
}