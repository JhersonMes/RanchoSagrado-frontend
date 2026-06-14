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

  logout(){        
    return this.http.get(`${environment.HOST}/auth/logout`);
  }

  showUserInfo(){
    return this.http.get<{ username: string }>(`${environment.HOST}/auth/user`);
  }
}