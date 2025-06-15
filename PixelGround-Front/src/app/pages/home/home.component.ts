import { Component, OnInit } from '@angular/core';
import { ActividadService } from '../../core/services/actividad.service';
import { Actividad } from '../../core/models/actividad.model';
import { CommonModule } from '@angular/common';
import { ListaJuegosService, ListaJuego } from '../../core/services/lista-juegos.service';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LucideIconsModule } from '../../shared/lucide.module';
import { RawgApiService } from '../../core/services/rawg-api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideIconsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  actividades: Actividad[] = [];
  cargando = true;
  nombreUsuario = '...';
  listas: ListaJuego[] = [];

  steamId: string | null = null;

  steamStats = {
    horasSemana: 0,
    juegoTop: '',
    juegoTopHoras: 0,
    tieneSteam: false,
    error: ''
  };

  constructor(
    private actividadService: ActividadService,
    private listaService: ListaJuegosService,
    private rawgApiService: RawgApiService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.steamId = usuario.steamId || null;
    this.nombreUsuario = usuario.nombreUsuario || '...';

    if (usuario.id) {
      this.listaService.obtenerListasDeUsuario(usuario.id).subscribe({
        next: (listas) => {
          this.enriquecerListasConImagenes(listas);
        },
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
          if (!juegos || juegos.length === 0) return;
          let totalMin = 0;
          let topJuego = juegos[0];
          for (const juego of juegos) {
            totalMin += juego.playtime_2weeks || 0;
            if ((juego.playtime_2weeks || 0) > (topJuego.playtime_2weeks || 0)) {
              topJuego = juego;
            }
          }
          this.steamStats.horasSemana = Math.round((totalMin / 2) / 60 * 10) / 10;
          this.steamStats.juegoTop = topJuego.name;
          this.steamStats.juegoTopHoras = Math.round((topJuego.playtime_2weeks / 2) / 60 * 10) / 10;
        },
        error: () => {
          this.steamStats.error = 'No se pudieron cargar las estadísticas de Steam.';
        },
      });
    }
  }

  enriquecerListasConImagenes(listas: ListaJuego[]) {
    const nuevasListas: ListaJuego[] = [];
    let pendientes = listas.length;

    if (pendientes === 0) {
      this.listas = [];
      return;
    }

    listas.forEach((lista) => {
      const primeraId = lista.juegosId?.[0];
      if (!primeraId) {
        nuevasListas.push({ ...lista, juegosId: [] });
        if (--pendientes === 0) this.listas = nuevasListas;
        return;
      }

      this.rawgApiService.obtenerJuegoPorId(+primeraId).subscribe({
        next: (juego) => {
          nuevasListas.push({
            ...lista,
            juegosId: [{ ...juego, imagenUrl: juego.background_image }]
          });
          if (--pendientes === 0) this.listas = nuevasListas;
        },
        error: () => {
          nuevasListas.push(lista);
          if (--pendientes === 0) this.listas = nuevasListas;
        },
      });
    });
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

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/no-image.png';
  }

  cargarImagenesParaFeed(): void {
    for (const actividad of this.actividades) {
      if ((!actividad.imagenUrlJuego || actividad.imagenUrlJuego === 'URL vacía') && actividad.juegoApiId) {
        const rawgId = Number(actividad.juegoApiId);
        if (!isNaN(rawgId)) {
          this.rawgApiService.obtenerJuegoPorId(rawgId).subscribe({
            next: (juego) => {
              actividad.imagenUrlJuego = juego.background_image || 'https://via.placeholder.com/64x64?text=Juego';
            },
            error: () => {
              actividad.imagenUrlJuego = 'https://via.placeholder.com/64x64?text=Juego';
            }
          });
        } else {
          actividad.imagenUrlJuego = 'https://via.placeholder.com/64x64?text=Juego';
        }
      }
    }
  }



}
