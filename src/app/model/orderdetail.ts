import { Client } from './client';
import { RestaurantTable } from './restauranttable';
import { Employee } from './employee';

export interface Order {
  idOrder?: number;
  orderDate: string; 
  status: string;     
  detail?: string;
  subTotal: number;
  total: number;
  client?: Client;
  restaurantTable?: RestaurantTable;
  employee: Employee;
}