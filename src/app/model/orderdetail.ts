import { Order } from './order';
import { Product } from './product';

export interface OrderDetail {
  idOrderDetail?: number;
  quantity: number;
  unitPrice: number;
  notes?: string;
  order: Partial<Order> & { idOrder: number };
  product: Product;
}
