import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  login(login: string, password: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/login`, { login, password }, { responseType: 'text' });
  }

  register(email: string, nombreUsuario: string, password: string): Observable<string> {
    const body = { email, nombreUsuario, password };
    return this.http.post('http://localhost:8080/api/usuarios/registro', body, {
      responseType: 'text'
    });
  }
  
  obtenerPerfil(token: string): Observable<any> {
    return this.http.get('http://localhost:8080/api/usuarios/perfil', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  
  
}
