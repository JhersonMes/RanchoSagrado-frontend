import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { GenericSignalService } from './generic-signal.service';
import { Promotion } from '../model/promotion';

@Injectable({ providedIn: 'root' })
export class PromotionService extends GenericSignalService<Promotion> {
  protected override url: string = `${environment.HOST}/promotions`;
}