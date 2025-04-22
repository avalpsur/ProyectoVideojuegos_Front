import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  obtenerListasDeUsuario(usuarioId: number): Observable<ListaJuego[]> {
    return this.http.get<ListaJuego[]>(`${this.baseUrl}/usuario/${usuarioId}`);
  }

  crearLista(lista: Partial<ListaJuego>): Observable<ListaJuego> {
    return this.http.post<ListaJuego>(this.baseUrl, lista);
  }

  añadirJuegoALista(listaId: number, juego: Juego): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${listaId}/juegos`, juego);
  }

  eliminarLista(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  
}
