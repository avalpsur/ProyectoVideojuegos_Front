import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RawgApiService } from '../../core/services/rawg-api.service';
import { VotacionService } from '../../core/services/votacion.service';
import { ActividadService } from '../../core/services/actividad.service';
import { ReviewService } from '../../core/services/review.service';
import { Review } from '../../core/models/review.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Votacion } from '../../core/models/votacion.model';

@Component({
  selector: 'app-juego-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './juego-detalle.component.html',
})
export class JuegoDetalleComponent implements OnInit {
  juego: any;
  id!: number;
  miVoto: number = 0;
  puntuacionMedia: number = 0;
  reviews: Review[] = [];
  nuevareview: string = '';

  constructor(
    private route: ActivatedRoute,
    private rawgApi: RawgApiService,
    private votacionService: VotacionService,
    private actividadService: ActividadService,
    private reviewService: ReviewService
  ) { }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.rawgApi.obtenerJuegoPorId(this.id).subscribe(juego => {
      this.juego = juego;
    });
    /*
        this.votacionService.obtenerMediaJuego(this.id).subscribe(media => {
          this.puntuacionMedia = media;
        });
    */
    this.votacionService.obtenerVotoUsuario(this.id).subscribe(voto => {
      this.miVoto = voto;
    });

    this.reviewService.getReviewsByJuego(this.id).subscribe(res => {
      this.reviews = res;
    });
  }

  votar(p: number): void {
    if (this.miVoto === p) return;

    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

    const voto: Votacion = {
      usuarioId: usuario.id,
      juegoApiId: this.id.toString(),
      puntuacion: p,
      nombreJuego: this.juego?.name || 'Juego desconocido',
      imagenUrlJuego: this.juego?.background_image || 'URL vacía'
    };

    this.miVoto = p;
    this.votacionService.votar(voto).subscribe({
      next: () => {
        this.cargarDatos();
        this.actividadService.registrarActividad(
          'voto',
          voto.juegoApiId,
          JSON.stringify({ puntuacion: voto.puntuacion })
        ).subscribe();
      },
      error: () => {
        alert("Error al enviar el voto");
        this.miVoto = 0;
      }
    });
  }


  enviarReview(): void {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

    const review: Review = {
      idUsuario: usuario.id,
      nombreUsuario: usuario.nombreUsuario,
      idJuego: this.id,
      nombreJuego: this.juego?.name || 'Juego desconocido',
      contenido: this.nuevareview
    };

    this.reviewService.crearReview({
      idUsuario: usuario.id,
      idJuego: this.id,
      nombreUsuario: usuario.nombreUsuario,
      nombreJuego: this.juego?.name,
      contenido: this.nuevareview
    }).subscribe(() => {
      this.nuevareview = '';
      this.cargarDatos();
    });
  }

  get generosTexto(): string {
    return this.juego?.genres?.map((g: any) => g.name).join(', ') || '';
  }
}
