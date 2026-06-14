import { Shift } from './shift';

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
}