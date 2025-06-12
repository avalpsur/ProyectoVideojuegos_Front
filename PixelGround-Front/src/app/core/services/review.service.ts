import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private get headers() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  getReviewsByJuego(idJuego: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/juego/${idJuego}`, {
      headers: this.headers
    });
  }

  getReviewsByUsuario(idUsuario: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/usuario/${idUsuario}`, {
      headers: this.headers
    });
  }

  crearReview(review: Review): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, review, {
      headers: this.headers
    });
  }

  editarReview(id: number, review: Review): Observable<Review> {
    return this.http.put<Review>(`${this.apiUrl}/${id}`, review, {
      headers: this.headers
    });
  }

  eliminarReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.headers
    });
  }
}
