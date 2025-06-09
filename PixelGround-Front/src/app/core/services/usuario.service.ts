import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  id: number;
  nombreUsuario: string;
  email: string;
  rol: string;
  avatar?: string; 
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  getUsuarioByEmail(email: string): Observable<Usuario> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.get<Usuario>(`${this.apiUrl}/email/${email}`, { headers });
  }

  getUsuarioByUsername(nombreUsuario: string): Observable<Usuario> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.get<Usuario>(`${this.apiUrl}/${nombreUsuario}`, { headers });
  }

  buscarUsuariosPorNombreParcial(nombre: string): Observable<Usuario[]> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.get<Usuario[]>(`${this.apiUrl}/buscar?nombre=${encodeURIComponent(nombre)}`, { headers });
  }

  getAllUsuarios(): Observable<Usuario[]> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<Usuario[]>(`${this.apiUrl}`, { headers });
  }

  cambiarRolUsuario(id: number, nuevoRol: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put(`${this.apiUrl}/${id}/cambiar-rol`, { nuevoRol }, { headers });
  }

  eliminarUsuario(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
}
