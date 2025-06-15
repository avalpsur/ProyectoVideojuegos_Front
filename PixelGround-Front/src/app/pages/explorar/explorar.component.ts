import { Component, HostListener, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ListaJuegosService, ListaJuego } from '../../core/services/lista-juegos.service';
import { RawgApiService } from '../../core/services/rawg-api.service';
import { VotacionService } from '../../core/services/votacion.service';
import { AuthService } from '../../core/services/auth.service';
import { Votacion } from '../../core/models/votacion.model';
import { Router } from '@angular/router';

interface ListaJuegoConPortada extends ListaJuego {
  portadaUrl?: string;
}

@Component({
  selector: 'app-explorar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './explorar.component.html',
  styleUrls: ['./explorar.component.css']
})
export class ExplorarComponent implements OnInit {
  query = '';
  resultados: any[] = [];
  listas: ListaJuegoConPortada[] = [];
  selectedJuegoId: number | null = null;
  nuevaListaNombre: string = '';
  filtroGenero: string = '';
  filtroPlataforma: string = '';
  generos: any[] = [];
  plataformas: any[] = [];
  usuarioId: number | null = null;
  puntuaciones: { [juegoId: string]: number } = {};
  hover: { [juegoId: string]: number } = {};

  paginaActual: number = 1;
  pageSize: number = 12;
  hayMasPaginas: boolean = true;

  @ViewChild('inputNuevaLista') inputNuevaLista!: ElementRef;

  constructor(
    private listaService: ListaJuegosService,
    private rawgService: RawgApiService,
    private votacionService: VotacionService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.authService.obtenerPerfil(token).subscribe({
      next: (usuario: any) => {
        this.usuarioId = usuario.id;
        localStorage.setItem('usuario', JSON.stringify(usuario));
        this.cargarListas();
        this.buscar();
      },
      error: (err) => console.error('Error al obtener perfil', err),
    });

    this.rawgService.getGeneros().subscribe({
      next: (data) => this.generos = data.results,
      error: (err) => console.error('Error al cargar géneros', err),
    });

    this.rawgService.getPlataformas().subscribe({
      next: (data) => this.plataformas = data.results,
      error: (err) => console.error('Error al cargar plataformas', err),
    });
  }

  cargarVotaciones(): void {
    if (!this.usuarioId) return;
    this.votacionService.obtenerVotacionesDeUsuario(this.usuarioId).subscribe({
      next: (votos: Votacion[]) => {
        votos.forEach(voto => {
          this.puntuaciones[voto.juegoApiId] = voto.puntuacion;
        });
      },
      error: (err) => console.error('Error al cargar votaciones previas:', err),
    });
  }

  buscar(): void {
    this.rawgService.buscarJuegos(this.query, this.filtroGenero, this.filtroPlataforma, this.paginaActual, this.pageSize).subscribe({
      next: (data) => {
        this.resultados = data.results;
        this.hayMasPaginas = !!data.next;
      },
      error: (err) => console.error('Error al buscar juegos:', err),
    });
  }

  cargarListas(): void {
    if (this.usuarioId) {
      this.listaService.obtenerListasDeUsuario(this.usuarioId).subscribe({
        next: (listas) => {
          // Para cada lista, obtener la portada
          this.listas = listas.map(lista => ({ ...lista, portadaUrl: '/assets/default-list-cover.png' }));
          this.listas.forEach((lista, idx) => {
            if (lista.juegosId && lista.juegosId.length > 0) {
              const primerId = lista.juegosId[0]?.apiId || lista.juegosId[0];
              if (primerId) {
                this.rawgService.obtenerJuegoPorId(Number(primerId)).subscribe({
                  next: (juegoRAWG) => {
                    this.listas[idx].portadaUrl = juegoRAWG.background_image || '/assets/default-list-cover.png';
                  },
                  error: () => {
                    this.listas[idx].portadaUrl = '/assets/default-list-cover.png';
                  }
                });
              }
            }
          });
        },
        error: (err) => console.error('Error al cargar listas', err),
      });
    }
  }

  toggleDropdown(juegoId: number, event: MouseEvent): void {
    event.stopPropagation();
    this.selectedJuegoId = this.selectedJuegoId === juegoId ? null : juegoId;
  }

  @HostListener('document:click')
  cerrarDropdown(): void {
    this.selectedJuegoId = null;
  }

  setPuntuacion(juegoId: string, valor: number) {
    this.puntuaciones[juegoId] = valor;
  }

  votar(juego: any): void {
    const puntuacion = this.puntuaciones[juego.id];
    if (puntuacion < 0 || puntuacion > 5) {
      alert("La puntuación debe estar entre 0 y 5");
      return;
    }

    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (!usuario?.id) {
      alert('Usuario no identificado');
      return;
    }

    const voto: Votacion = {
      usuarioId: usuario.id,
      juegoApiId: juego.id.toString(),
      puntuacion,
      nombreJuego: juego.name || 'Juego desconocido',
      imagenUrlJuego: juego.background_image || 'URL vacía'
    };

    this.votacionService.votar(voto).subscribe({
      next: () => {
        this.puntuaciones[voto.juegoApiId] = voto.puntuacion;
        alert(`Has votado ${voto.nombreJuego} con ${voto.puntuacion} estrellas`);
      },
      error: () => alert("Error al enviar el voto")
    });
  }

  verDetalle(id: number): void {
    this.router.navigate(['/juego', id]);
  }

  cambiarPagina(delta: number): void {
    const nuevaPagina = this.paginaActual + delta;
    if (nuevaPagina < 1) return;
    this.paginaActual = nuevaPagina;
    this.buscar();
  }

  anadirJuegoALista(listaId: number, juego: any): void {
    this.listaService.anadirJuegoALista(listaId, {
      apiId: juego.id.toString(),
      nombre: juego.name || 'Nombre desconocido'
    }).subscribe({
      next: () => {
        alert('Juego añadido a la lista correctamente');
        this.selectedJuegoId = null;
      },
      error: (err) => {
        console.error('Error al añadir juego a la lista:', err);
        alert('Error al añadir juego a la lista');
      }
    });
  }

  eliminarJuegoDeLista(listaId: number, juegoId: number): void {
    this.listaService.eliminarJuegoDeLista(listaId, juegoId.toString()).subscribe({
      next: () => {
        alert('Juego eliminado de la lista correctamente');
        this.selectedJuegoId = null;
      },
      error: (err) => {
        console.error('Error al eliminar juego de la lista:', err);
        alert('Error al eliminar juego de la lista');
      }
    });
  }

  modalAbierto: boolean = false;
  modalJuegoId: number | null = null;

  abrirModal(juegoId: number): void {
    this.modalAbierto = true;
    this.modalJuegoId = juegoId;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.modalJuegoId = null;
  }

  crearYAnadirLista(juegoId: number, nombreLista: string): void {
    if (!nombreLista.trim()) {
      alert('El nombre de la lista no puede estar vacío');
      return;
    }
    if (!this.usuarioId) {
      alert('Usuario no identificado');
      return;
    }
    this.listaService.crearLista({
      usuarioId: this.usuarioId,
      nombre: nombreLista
    }).subscribe({
      next: (nuevaLista: ListaJuego) => {
        this.listas.push(nuevaLista);
        this.anadirJuegoALista(nuevaLista.id, juegoId);
      },
      error: (err) => {
        console.error('Error al crear la lista:', err);
        alert('Error al crear la lista');
      }
    });
  }

}
