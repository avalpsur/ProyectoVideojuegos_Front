import { Component, HostListener, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListaJuegosService, ListaJuego } from '../../core/services/lista-juegos.service';
import { decodeToken } from '../../core/helpers/jwt-helper';
import { RawgApiService } from '../../core/services/rawg-api.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { VotacionService } from '../../core/services/votacion.service';
import { Votacion } from '../../core/models/votacion.model';
import { StarRatingModule } from 'ngx-star-rating';


@Component({
  selector: 'app-explorar',
  standalone: true,
  imports: [CommonModule, FormsModule],
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


  @ViewChild('inputNuevaLista') inputNuevaLista!: ElementRef;

  constructor(
    private listaService: ListaJuegosService,
    private rawgService: RawgApiService,
    private usuarioService: UsuarioService,
    private votacionService: VotacionService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const decoded = decodeToken(token);
    const email = decoded?.sub;

    if (email) {
      this.usuarioService.getUsuarioByEmail(email).subscribe({
        next: (usuario) => {
          this.usuarioId = usuario.id;
          this.cargarListas();
        },
        error: (err) => console.error('Error al obtener usuario', err),
      });
    }

    this.rawgService.obtenerJuegosPopulares().subscribe({
      next: (data) => this.resultados = data.results,
      error: (err) => console.error('Error al cargar juegos populares:', err),
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

  buscar(): void {
    if (!this.query.trim()) return;

    this.rawgService.buscarJuegos(this.query, this.filtroGenero, this.filtroPlataforma).subscribe({
      next: (data) => this.resultados = data.results,
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

  votar(juego: any): void {
  const puntuacion = this.puntuaciones[juego.id];
  if (puntuacion < 0 || puntuacion > 5) {
    alert("La puntuación debe estar entre 0 y 5");
    return;
  }

  const usuarioId = +sessionStorage.getItem('usuarioId')!; // Asegúrate de guardar el ID en login
  const voto: Votacion = {
    usuarioId,
    juegoApiId: juego.id,
    puntuacion,
    nombreJuego: juego.name,
    imagenUrlJuego: juego.background_image
  };

  this.votacionService.votar(voto).subscribe({
    next: () => alert(`Has votado ${juego.name} con ${puntuacion} estrellas`),
    error: () => alert("Error al enviar el voto")
  });
}
  
  
}
