import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AmistadService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  private getHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  enviarSolicitud(receptorId: number): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/solicitar`,
      { receptor: receptorId },
      this.getHeaders()
    );
  }

  aceptarSolicitud(solicitanteId: number): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/aceptar`,
      { solicitanteId },
      this.getHeaders()
    );
  }

  rechazarSolicitud(solicitanteId: number): Observable<void> {
    return this.http.request<void>(
      'delete',
      `${this.apiUrl}/rechazar`,
      {
        body: { solicitanteId },
        ...this.getHeaders()
      }
    );
  }

  obtenerAmigos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/amigos`, this.getHeaders());
  }

  obtenerSolicitudes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/solicitudes`, this.getHeaders());
  }
}
