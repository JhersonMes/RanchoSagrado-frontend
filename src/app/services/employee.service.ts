import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { GenericSignalService } from './generic-signal.service';
import { Employee } from '../model/employee';

@Injectable({ providedIn: 'root' })
export class EmployeeService extends GenericSignalService<Employee> {
  protected override url: string = `${environment.HOST}/employees`;
}