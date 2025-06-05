import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Actividad } from '../models/actividad.model';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {
  private apiUrl = 'http://localhost:8080/actividad';

  constructor(private http: HttpClient) { }

  private get headers(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  obtenerFeed(): Observable<Actividad[]> {
    return this.http.get<Actividad[]>(`${this.apiUrl}/feed`, { headers: this.headers });
  }

  registrarActividad(
    tipo: string,
    juegoApiId: string,
    contenidoExtra: string,
    extras?: {
      usuarioId: number;
      nombreUsuario: string;
      nombreJuego: string;
      imagenUrlJuego: string;
    }
  ): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const body = {
      tipo,
      juegoApiId,
      contenidoExtra,
      ...extras
    };

    return this.http.post(`${this.apiUrl}/registrar`, body, { headers });
  }


}
