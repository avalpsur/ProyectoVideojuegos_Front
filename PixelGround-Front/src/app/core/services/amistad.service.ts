import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AmistadService {
  private apiUrl = '/api/amistades';

  constructor(private http: HttpClient) {}

  enviarSolicitud(receptorId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/solicitar`, { receptorId });
  }

  aceptarSolicitud(solicitanteId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/aceptar`, { solicitanteId });
  }

  rechazarSolicitud(solicitanteId: number): Observable<void> {
    return this.http.request<void>('delete', `${this.apiUrl}/rechazar`, {
      body: { solicitanteId }
    });
  }

  obtenerAmigos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/amigos`);
  }

  obtenerSolicitudes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/solicitudes`);
  }
}
