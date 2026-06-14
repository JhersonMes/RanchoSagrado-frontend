import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { GenericSignalService } from './generic-signal.service';
import { Contract } from '../model/contract';

@Injectable({ providedIn: 'root' })
export class ContractService extends GenericSignalService<Contract> {
  protected override url: string = `${environment.HOST}/contracts`;
}