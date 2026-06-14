import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { GenericSignalService } from './generic-signal.service';
import { Shift } from '../model/shift';

@Injectable({ providedIn: 'root' })
export class ShiftService extends GenericSignalService<Shift> {
  protected override url: string = `${environment.HOST}/shifts`;
}