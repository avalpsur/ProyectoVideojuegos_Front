import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reto {
  id?: number;
  titulo: string;
  descripcion: string;
  juego: string;
  fechaInicio: string;
  fechaExpiracion: string;
  idCreador?: number;
  nombreUsuarioCreador?: string;
}

export interface ParticipanteReto {
  id?: number;
  usuarioId: number;
  nombreUsuario: string;
  retoId: number;
  tituloReto: string;
  comentario: string;
  imagenPruebaUrl: string | null;
  completado: boolean;
  fechaCompletado: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class RetosService {
  private apiUrl = 'http://localhost:8080/api/retos';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getRetosActivos(): Observable<Reto[]> {
    return this.http.get<Reto[]>(`${this.apiUrl}/activos`, {
      headers: this.getAuthHeaders()
    });
  }

  getTodosLosRetos(): Observable<Reto[]> {
    return this.http.get<Reto[]>(`${this.apiUrl}`, {
      headers: this.getAuthHeaders()
    });
  }

  getRetosPorUsuario(usuarioId: number): Observable<ParticipanteReto[]> {
    return this.http.get<ParticipanteReto[]>(`${this.apiUrl}/usuarios/usuario/${usuarioId}`, {
      headers: this.getAuthHeaders()
    });
  }

  unirseAReto(participacion: ParticipanteReto): Observable<ParticipanteReto> {
    return this.http.post<ParticipanteReto>(`${this.apiUrl}/usuarios`, participacion, {
      headers: this.getAuthHeaders()
    });
  }

  completarReto(participacionId: number, comentario: string, imagenUrl: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuarios/${participacionId}/completar`, {
      comentario,
      imagenUrl
    }, {
      headers: this.getAuthHeaders()
    });
  }

  crearReto(reto: any): Observable<Reto> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<Reto>(`${this.apiUrl}`, reto, { headers });
  }
}
