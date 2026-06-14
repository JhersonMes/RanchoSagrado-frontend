import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { GenericSignalService } from './generic-signal.service';
import { User } from '../model/user';

@Injectable({ providedIn: 'root' })
export class UserService extends GenericSignalService<User> {
  protected override url: string = `${environment.HOST}/users`;
}