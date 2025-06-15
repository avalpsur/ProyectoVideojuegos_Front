import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Juego {
  id?: number;
  apiId: string;
  nombre?: string;
  imagenUrl?: string;
}

export interface ListaJuego {
  id: number;
  nombre: string;
  descripcion: string;
  usuarioId: number;
  juegosId: Juego[];
  publica: boolean;
  miembrosId: number[];
}

@Injectable({ providedIn: 'root' })
export class ListaJuegosService {
  private apiUrl = `${environment.apiUrl}/listas`;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  obtenerListasDeUsuario(usuarioId: number): Observable<ListaJuego[]> {
    return this.http.get<ListaJuego[]>(
      `${this.apiUrl}/usuario/${usuarioId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  obtenerListaPorId(id: number): Observable<ListaJuego> {
    return this.http.get<ListaJuego>(
      `${this.apiUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  obtenerListasPublicas(): Observable<ListaJuego[]> {
    return this.http.get<ListaJuego[]>(
      `${this.apiUrl}/publicas`
    );
  }

  crearLista(lista: Partial<ListaJuego>): Observable<ListaJuego> {
    return this.http.post<ListaJuego>(
      this.apiUrl,
      lista,
      { headers: this.getAuthHeaders() }
    );
  }

  anadirJuegoALista(listaId: number, juego: { apiId: string; nombre?: string }): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${listaId}/juegos`,
      juego,
      { headers: this.getAuthHeaders() }
    );
  }


  eliminarLista(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  unirseALista(listaId: number): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${listaId}/unirse`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  cambiarVisibilidad(listaId: number): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/${listaId}/visibilidad`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  eliminarJuegoDeLista(listaId: number, apiId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${listaId}/juegos/${apiId}`,
      { headers: this.getAuthHeaders() }
    );
  }

}
