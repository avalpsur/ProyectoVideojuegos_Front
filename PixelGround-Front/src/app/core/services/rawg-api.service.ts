import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RawgApiService {
  private apiKey = '00d51ae6c49d4dfba5a083ac4f120b4d';
  private baseUrl = 'https://api.rawg.io/api';

  constructor(private http: HttpClient) {}

  buscarJuegos(query: string, genero: string = '', plataforma: string = ''): Observable<any> {
    const params: any = {
      key: this.apiKey,
      search: query
    };
  
    if (genero) params.genres = genero;
    if (plataforma) params.platforms = plataforma;
  
    return this.http.get(`${this.baseUrl}/games`, { params });
  }
  
  

  obtenerJuegosPopulares(): Observable<any> {
    return this.http.get(`${this.baseUrl}/games`, {
      params: {
        key: this.apiKey
      }
    });
  }
  
  getGeneros(): Observable<any> {
    return this.http.get(`${this.baseUrl}/genres`, {
      params: { key: this.apiKey }
    });
  }
  
  getPlataformas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/platforms/lists/parents`, {
      params: { key: this.apiKey }
    });
  }
  
}
