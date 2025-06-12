import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-steam-callback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './steam-callback.component.html',
  styleUrls: ['./steam-callback.component.css']
})
export class SteamCallbackComponent implements OnInit {
  mensaje = 'Procesando vinculación...';
  error = false;
  private apiUrl = `${environment.apiUrl}/actividad`;


  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const params = new URLSearchParams(window.location.search);
    const claimedId = params.get('openid.claimed_id');
    const token = localStorage.getItem('token');

    if (claimedId && token) {
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

      this.http.get('${environment.apiUrl}/usuarios/vincularSteam', {
        headers,
        params: { 'openid.claimed_id': claimedId }
      }).subscribe({
        next: () => {
          this.mensaje = '¡Cuenta de Steam vinculada correctamente!';
          setTimeout(() => this.router.navigate(['/perfil']), 1500);
        },
        error: () => {
          this.mensaje = 'Error al vincular cuenta de Steam.';
          this.error = true;
        }
      });
    } else {
      this.mensaje = 'Parámetros incorrectos o no autenticado.';
      this.error = true;
    }
  }
}
