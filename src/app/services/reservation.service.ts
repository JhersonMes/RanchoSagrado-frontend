import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { GenericSignalService } from './generic-signal.service';
import { Reservation } from '../model/reservation';

@Injectable({ providedIn: 'root' })
export class ReservationService extends GenericSignalService<Reservation> {
  protected override url: string = `${environment.HOST}/reservations`;
}