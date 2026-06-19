import { Employee } from './employee';
import { Supplier } from './supplier';
// Define la estructura de datos utilizada para gestionar los contratos de empleados y proveedores.
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
