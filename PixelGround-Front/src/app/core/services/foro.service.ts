import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api/foro';

@Injectable({
  providedIn: 'root'
})
export class ForoService {

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getTemas(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/temas`, { headers: this.getAuthHeaders() });
  }

  crearTema(nombre: string, descripcion: string): Observable<any> {
    const body = { nombre, descripcion };
    return this.http.post(`${API_URL}/tema`, body, { headers: this.getAuthHeaders() });
  }

  eliminarTema(temaId: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/tema/${temaId}`, { headers: this.getAuthHeaders() });
  }

  getHilosPorTema(temaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/tema/${temaId}/hilos`, { headers: this.getAuthHeaders() });
  }

  crearHilo(temaId: number, titulo: string, contenido: string): Observable<any> {
    const body = { temaId, titulo, contenido };
    return this.http.post(`${API_URL}/hilo`, body, { headers: this.getAuthHeaders() });
  }

  responderHilo(hiloId: number, contenido: string): Observable<any> {
    const body = { contenido };
    return this.http.post(`${API_URL}/hilo/${hiloId}/responder`, body, { headers: this.getAuthHeaders() });
  }

  eliminarHilo(hiloId: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/hilo/${hiloId}`, { headers: this.getAuthHeaders() });
  }

  cambiarTemaDelHilo(hiloId: number, nuevoTemaId: number): Observable<any> {
    return this.http.put(`${API_URL}/hilo/${hiloId}/cambiar-tema/${nuevoTemaId}`, null, { headers: this.getAuthHeaders() });
  }

  getRespuestasDeHilo(hiloId: number): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/hilo/${hiloId}/respuestas`, {
      headers: this.getAuthHeaders()
    });
  }

  getHiloPorId(hiloId: number): Observable<any> {
    return this.http.get<any>(`${API_URL}/hilo/${hiloId}`, { headers: this.getAuthHeaders() });
  }

  getRespuestasHilo(hiloId: number): Observable<any[]> {
  return this.http.get<any[]>(`${API_URL}/hilo/${hiloId}/respuestas`, { headers: this.getAuthHeaders() });
}

}
