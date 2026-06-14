import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { GenericSignalService } from './generic-signal.service';
import { Menu } from '../model/menu';

@Injectable({ providedIn: 'root' })
export class MenuService extends GenericSignalService<Menu> {
  protected override url: string = `${environment.HOST}/menus`;
}