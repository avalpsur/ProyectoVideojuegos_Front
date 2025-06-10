import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Juego {
  id: number;
  apiId: string;
  nombre: string;
  imagenUrl: string;
}

export interface ListaJuego {
  id: number;
  nombre: string;
  descripcion: string;
  usuarioId: number;
  juegos: Juego[];
}

@Injectable({ providedIn: 'root' })
export class ListaJuegosService {
  private baseUrl = 'http://localhost:8080/api/listas';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  obtenerListasDeUsuario(usuarioId: number): Observable<ListaJuego[]> {
    return this.http.get<ListaJuego[]>(
      `${this.baseUrl}/usuario/${usuarioId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  crearLista(lista: Partial<ListaJuego>): Observable<ListaJuego> {
    return this.http.post<ListaJuego>(
      this.baseUrl,
      lista,
      { headers: this.getAuthHeaders() }
    );
  }

  anadirJuegoALista(listaId: number, apiId: number): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/${listaId}/juegos`,
      { apiId },
      { headers: this.getAuthHeaders() }
    );
  }
  eliminarJuegoDeLista(listaId: number, apiId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/${listaId}/juegos/${apiId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  eliminarLista(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }
}
