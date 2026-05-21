import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Client } from '../model/client';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private url: string = `${environment.HOST}/clients`;

  private readonly http = inject(HttpClient);

  private readonly _clients = signal<Client[]>([]);
  private readonly _message = signal<string>('');

  readonly $clientsChange = this._clients.asReadonly();
  readonly $messageChange = this._message.asReadonly();

  // get post put delete
  findAll() {
    return this.http.get<Client[]>(this.url);
  }

  findById(id: number) {
    return this.http.get<Client>(`${this.url}/${id}`);
  }

  save(client: Client) {
    return this.http.post(this.url, client);
  }

  update(id: number, client: Client) {
    return this.http.put(`${this.url}/${id}`, client);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  ////set////
  setClientChange(data: Client[]) {
    this._clients.set(data);
  }

  setMessageChange(msg: string) {
    this._message.set(msg);
  }
}
