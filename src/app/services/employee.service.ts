import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { GenericSignalService } from './generic-signal.service';
import { Employee } from '../model/employee';

@Injectable({ providedIn: 'root' })
export class EmployeeService extends GenericSignalService<Employee> {
  protected override url: string = `${environment.HOST}/employees`;

  /**
   * Empleado vinculado a la cuenta autenticada. Si no tiene uno asociado (ej. Cliente)
   * o la consulta falla, ServerErrorInterceptor silencia el error sin mostrar un toast
   * (ver interceptor/server-error.interceptor.ts) y este observable simplemente no emite.
   */
  findMine() {
    return this.http.get<Employee | null>(`${this.url}/me`);
  }
}