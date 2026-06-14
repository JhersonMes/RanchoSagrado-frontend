import { Order } from './order';

export interface Payment {
  idPayment?: number;
  paymentDate: string;   
  amount: number;
  paymentMethod: string;  
  cardDetails: string;
  status: string;         
  order: Order;
}