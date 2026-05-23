import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Client } from '../model/client';
import { GenericSignalService } from './generic-signal.service';

@Injectable({
  providedIn: 'root',
})
export class ClientService extends GenericSignalService<Client> {
  
  protected override url: string = `${environment.HOST}/clients`;

}