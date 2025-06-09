import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Votacion } from '../models/votacion.model';

@Injectable({ providedIn: 'root' })
export class VotacionService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  private get headers() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  votar(votacion: Votacion): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/votaciones`, votacion, { headers });
  }

  obtenerMediaJuego(idJuego: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/media/${idJuego}`, { headers: this.headers });
  }

  obtenerVotoUsuario(idJuego: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/usuario/voto/${idJuego}`, { headers: this.headers });
  }

  obtenerVotacionesDeUsuario(usuarioId: number): Observable<Votacion[]> {
    return this.http.get<Votacion[]>(`${this.apiUrl}/usuario/${usuarioId}`, { headers: this.headers });
  }
}
