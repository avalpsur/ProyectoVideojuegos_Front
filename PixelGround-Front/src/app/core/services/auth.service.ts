import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
private apiUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient) { }

  login(login: string, password: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/auth/login`, { login, password }, { responseType: 'text' });
  }

  register(email: string, nombreUsuario: string, password: string): Observable<string> {
    const body = { email, nombreUsuario, password };
    return this.http.post(`${this.apiUrl}/usuarios/registro`, body, {
      responseType: 'text'
    });
  }

  obtenerPerfil(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/perfil`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
