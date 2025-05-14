import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AmistadService {
  private apiUrl = '/api/amistades';

  constructor(private http: HttpClient) {}

  enviarSolicitud(solicitanteId: number, receptorId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/solicitar`, { solicitanteId, receptorId });
  }

  aceptarSolicitud(receptorId: number, solicitanteId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/aceptar`, { receptorId, solicitanteId });
  }

  rechazarSolicitud(receptorId: number, solicitanteId: number): Observable<void> {
    return this.http.request<void>('delete', `${this.apiUrl}/rechazar`, { body: { receptorId, solicitanteId } });
  }

  obtenerAmigos(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/amigos/${id}`);
  }

  obtenerSolicitudes(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/solicitudes/${id}`);
  }
}
