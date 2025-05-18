import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  id: number;
  nombreUsuario: string;
  email: string;
  rol: string;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  getUsuarioByEmail(email: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/email/${email}`);
  }

  getUsuarioByUsername(nombreUsuario: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}//${nombreUsuario}`);
  }
}
