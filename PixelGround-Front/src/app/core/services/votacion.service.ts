import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Votacion } from '../models/votacion.model';

@Injectable({ providedIn: 'root' })
export class VotacionService {
  private apiUrl = 'http://localhost:8080/votaciones';

  constructor(private http: HttpClient) {}

  votar(voto: Votacion): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apiUrl, voto, { headers });
  }
}
