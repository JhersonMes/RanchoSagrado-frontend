import { Role } from './role';

export interface User {
  idUser?: number;
  username: string;
  email: string;
  password?: string;
  enabled: boolean;
  role: Role;
}