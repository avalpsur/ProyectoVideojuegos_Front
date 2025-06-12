import { Component, OnInit } from '@angular/core';
import { ActividadService } from '../../core/services/actividad.service';
import { Actividad } from '../../core/models/actividad.model';
import { CommonModule } from '@angular/common';
import { ListaJuegosService, ListaJuego } from '../../core/services/lista-juegos.service';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  actividades: Actividad[] = [];
  cargando = true;
  nombreUsuario = '...';
  listas: ListaJuego[] = [];

  steamId: string | null = null;

  steamStats: {
    horasSemana: number;
    juegoTop: string;
    juegoTopHoras: number;
    tieneSteam: boolean;
    error?: string;
  } = {
      horasSemana: 0,
      juegoTop: '',
      juegoTopHoras: 0,
      tieneSteam: false,
    };

  constructor(
    private actividadService: ActividadService,
    private listaService: ListaJuegosService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.steamId = usuario.steamId || null;
    this.nombreUsuario = usuario.nombreUsuario || '...';
    if (usuario.id) {
      this.listaService.obtenerListasDeUsuario(usuario.id).subscribe({
        next: (listas) => (this.listas = listas),
        error: () => (this.listas = []),
      });
    }
    this.actividadService.obtenerFeed().subscribe({
      next: (res: Actividad[]) => {
        this.actividades = res;
        this.cargando = false;
      },
      error: () => (this.cargando = false),
    });

    if (this.steamId) {
      this.steamStats.tieneSteam = true;
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
      this.http.get<any[]>(`${environment.apiUrl}/steam/recientes`, { headers }).subscribe({
        next: (juegos) => {
          if (!juegos || juegos.length === 0) {
            this.steamStats.horasSemana = 0;
            this.steamStats.juegoTop = '';
            this.steamStats.juegoTopHoras = 0;
            return;
          }
          let totalMin = 0;
          let topJuego = juegos[0];
          for (const juego of juegos) {
            totalMin += juego.playtime_2weeks || 0;
            if ((juego.playtime_2weeks || 0) > (topJuego.playtime_2weeks || 0)) {
              topJuego = juego;
            }
          }
          this.steamStats.horasSemana = Math.round((totalMin / 2) / 60 * 10) / 10; // mitad de minutos a horas, 1 decimal
          this.steamStats.juegoTop = topJuego.name;
          this.steamStats.juegoTopHoras = Math.round((topJuego.playtime_2weeks / 2) / 60 * 10) / 10;
        },
        error: () => {
          this.steamStats.error = 'No se pudieron cargar las estadísticas de Steam.';
        },
      });
    } else {
      this.steamStats.tieneSteam = false;
    }
  }

  vincularSteam() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    window.location.href = `${environment.apiUrl}/steam/login?email=${usuario.email}`;
  }



  extraerPuntuacion(contenidoExtra: string): string {
    try {
      const obj = JSON.parse(contenidoExtra);
      return obj.puntuacion?.toFixed(1) ?? 'N/A';
    } catch {
      return contenidoExtra?.length < 10 ? contenidoExtra : 'N/A';
    }
  }

  isImagenValida(url: string): boolean {
    return !!url && url !== 'URL vacía';
  }
}
