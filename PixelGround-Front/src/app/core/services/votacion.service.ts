import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Votacion } from '../models/votacion.model';

@Injectable({ providedIn: 'root' })
export class VotacionService {
  private apiUrl = 'http://localhost:8080/api/votaciones';

  constructor(private http: HttpClient) {}

  votar(votacion: Votacion): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.post(this.apiUrl, votacion, { headers });
  }

  obtenerVotacionesDeUsuario(usuarioId: number): Observable<Votacion[]> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.get<Votacion[]>(`${this.apiUrl}/usuario/${usuarioId}`, { headers });
  }
}
