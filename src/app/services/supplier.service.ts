import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Supplier } from '../model/supplier';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private url = `${environment.HOST}/suppliers`; // ES6

  //constructor(private readonly http: HttpClient) {}
  private readonly http = inject(HttpClient);

  // GET, POST, PUT, DELETE methods for categories will be implemented here
  findAll() {
    return this.http.get<Supplier[]>(this.url);
  }
}
