import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  login(login: string, password: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/login`, { login, password }, { responseType: 'text' });
  }
}
