import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Client } from '../model/client';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private url = `${environment.HOST}/clients`;

  private readonly http = inject(HttpClient);

  findAll() {
    return this.http.get<Client[]>(this.url);
  }
}
