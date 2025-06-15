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
import { Router } from '@angular/router';
import { ListaJuegosService, ListaJuego } from '../../core/services/lista-juegos.service';

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
  showAddToListModal: boolean = false;
  mostrarDescripcionCompleta: boolean = false;
  listas: ListaJuego[] = [];
  nuevaListaNombre: string = '';
  usuarioId: number | null = null;
  addToListError: string = '';

  constructor(
    private route: ActivatedRoute,
    private rawgApi: RawgApiService,
    private votacionService: VotacionService,
    private actividadService: ActividadService,
    private reviewService: ReviewService,
    private listaService: ListaJuegosService,
    public router: Router // Inyectar Router y hacerlo público
  ) { }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.usuarioId = usuario.id || null;
    this.cargarDatos();
    this.cargarListas();
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

  cargarListas(): void {
    if (!this.usuarioId) return;
    this.listaService.obtenerListasDeUsuario(this.usuarioId).subscribe({
      next: listas => this.listas = listas,
      error: () => this.listas = []
    });
  }

  votar(): void {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (!usuario?.id || !this.miVoto) {
      alert('Debes seleccionar una puntuación primero');
      return;
    }

    const voto: Votacion = {
      usuarioId: usuario.id,
      juegoApiId: this.juego.id.toString(),
      puntuacion: this.miVoto,
      nombreJuego: this.juego.name || 'Juego desconocido',
      imagenUrlJuego: this.juego.background_image || 'URL vacía'
    };

    this.votacionService.votar(voto).subscribe({
      next: () => {
        this.actividadService.registrarActividad(
          'voto',
          voto.juegoApiId,
          JSON.stringify({ puntuacion: voto.puntuacion }),
          {
            usuarioId: usuario.id,
            nombreUsuario: usuario.nombreUsuario,
            nombreJuego: voto.nombreJuego,
            imagenUrlJuego: voto.imagenUrlJuego
          }
        ).subscribe();
        alert(`Has votado ${voto.nombreJuego} con ${voto.puntuacion} estrellas`);
      },
      error: () => {
        alert('Error al enviar el voto');
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

  abrirModalAnadirLista(): void {
    this.showAddToListModal = true;
  }

  cerrarModalAnadirLista(): void {
    this.showAddToListModal = false;
  }

  anadirJuegoALista(listaId: number): void {
    if (!this.juego) return;
    this.listaService.anadirJuegoALista(listaId, {
      apiId: this.juego.id.toString(),
      nombre: this.juego.name
    }).subscribe({
      next: () => {
        this.addToListError = '';
        this.cerrarModalAnadirLista();
      },
      error: () => {
        this.addToListError = 'Error al añadir el juego a la lista';
      }
    });
  }

  crearYAnadirLista(): void {
    if (!this.nuevaListaNombre.trim() || !this.usuarioId) return;
    this.listaService.crearLista({
      usuarioId: this.usuarioId,
      nombre: this.nuevaListaNombre
    }).subscribe({
      next: (nuevaLista) => {
        this.listas.push(nuevaLista);
        this.anadirJuegoALista(nuevaLista.id);
        this.nuevaListaNombre = '';
      },
      error: () => {
        this.addToListError = 'Error al crear la lista';
      }
    });
  }

  setPuntuacion(valor: number): void {
    this.miVoto = valor;
  }
}
