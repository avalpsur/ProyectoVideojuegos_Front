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
  listas: ListaJuego[] = [];
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
        this.buscar(); // Carga inicial con paginación
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
        next: (listas) => this.listas = listas,
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

}
