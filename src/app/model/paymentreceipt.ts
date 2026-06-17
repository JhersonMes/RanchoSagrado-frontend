import { Order } from './order';

export interface PaymentReceipt {
  idReceipt?: number;
  order: Order;
  receiptType: string;    
  receiptNumber: string;
  series: string;
  emissionDate: string;  
  subTotal: number;
  igv: number;
  totalAmount: number;
  status: string;        
  paymentMethod: string;
  businessName?: string;
  ruc?: string;
  fiscalAddress?: string;
}