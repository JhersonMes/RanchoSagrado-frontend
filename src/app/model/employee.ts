import { Shift } from './shift';
import { User } from './user';

export interface Employee {
  idEmployee?: number;
  name: string;
  lastName: string;
  address: string;
  job: string;
  phone: string;
  status: string;
  dni: string;
  shifts?: Shift[];
  // Cuenta de sistema vinculada a este empleado, si tiene (ver /employees/me).
  user?: User;
}