import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { GenericSignalService } from './generic-signal.service';
import { Role } from '../model/role';

@Injectable({ providedIn: 'root' })
export class RoleService extends GenericSignalService<Role> {
  protected override url: string = `${environment.HOST}/roles`;
}