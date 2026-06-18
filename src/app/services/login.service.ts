import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

interface ILoginRequest{
  username: string;
  password: string;
}


@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private url: string = `${environment.HOST}/login`;

  private http = inject(HttpClient);

  login(username: string, password: string) {
    const body: ILoginRequest = { username, password };

    return this.http.post<any>(this.url, body);
  }

  register(username: string, email: string, password: string, employee: any, role: any) {
    const body = { username, email, password, employee, role, enabled: true };
    return this.http.post<any>(`${environment.HOST}/register`, body); // Ajustar URL si tu backend usa otra (ej. /users)
  }

  logout(){        
    return this.http.get(`${environment.HOST}/auth/logout`);
  }

  showUserInfo(){
    return this.http.get<any>(`${environment.HOST}/auth/user`);
  }
}