import { Employee } from './employee';
import { Supplier } from './supplier';

export interface Contract {
  idContract?: number;
  startDate: string;      
  endDate?: string;
  contractType: string;
  salary: number;        
  clause?: string;
  employee: Employee;
  supplier?: Supplier;
}