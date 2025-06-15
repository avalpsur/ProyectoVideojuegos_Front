import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaJuegosService, ListaJuego } from '../../core/services/lista-juegos.service';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RawgApiService } from '../../core/services/rawg-api.service';

interface ListaJuegoConPortada extends ListaJuego {
  portadaUrl?: string | null;
}

@Component({
  selector: 'app-mis-juegos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './mis-juegos.component.html',
  styleUrls: ['./mis-juegos.component.css']
})
export class MisJuegosComponent implements OnInit {
  listas: ListaJuegoConPortada[] = [];
  nombreLista: string = '';
  descripcionLista: string = '';
  usuarioId: number | null = null;
  paginaActual: number = 1;
  elementosPorPagina: number = 8;
  filtroNombreLista: string = '';

  constructor(
    private listaService: ListaJuegosService,
    private authService: AuthService,
    private router: Router,
    private rawgApiService: RawgApiService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.authService.obtenerPerfil(token).subscribe({
      next: (perfil) => {
        this.usuarioId = perfil.id;
        this.cargarListas();
      },
      error: (err) => console.error('Error al obtener perfil del usuario', err)
    });
  }

  cargarListas(): void {
  this.listaService.obtenerListasDeUsuario(this.usuarioId!).subscribe({
    next: (listas) => {
      this.listas = listas.map(lista => ({ ...lista, portadaUrl: null }));

      this.listas.forEach(lista => {
        if (lista.juegosId?.length > 0) {
          const apiId = lista.juegosId[0];
          this.rawgApiService.obtenerJuegoPorId(Number(apiId)).subscribe({
            next: juego => {
              lista.portadaUrl = juego.background_image;
            },
            error: () => {
              lista.portadaUrl = null; 
            }
          });
        }
      });
    },
    error: (err) => console.error('Error al cargar listas', err),
  });
}


  crearLista(): void {
    if (!this.nombreLista.trim() || !this.usuarioId) return;

    this.listaService.crearLista({
      nombre: this.nombreLista,
      descripcion: this.descripcionLista,
      usuarioId: this.usuarioId
    }).subscribe({
      next: (nuevaLista) => {
        this.listas.push(nuevaLista);
        this.nombreLista = '';
        this.descripcionLista = '';
      },
      error: (err) => console.error('Error al crear lista', err)
    });
  }

  eliminarLista(id: number): void {
    this.listaService.eliminarLista(id).subscribe({
      next: () => {
        this.listas = this.listas.filter(lista => lista.id !== id);
      },
      error: (err) => {
        console.error('Error al eliminar lista', err);
      }
    });
  }

  get listasFiltradas(): ListaJuegoConPortada[] {
    if (!this.filtroNombreLista.trim()) return this.listas;
    const filtro = this.filtroNombreLista.trim().toLowerCase();
    return this.listas.filter(l => l.nombre.toLowerCase().includes(filtro));
  }

  get listasPaginadas(): ListaJuegoConPortada[] {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    return this.listasFiltradas.slice(inicio, inicio + this.elementosPorPagina);
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.listasFiltradas.length / this.elementosPorPagina));
  }

  cambiarPagina(delta: number) {
    this.paginaActual += delta;
    if (this.paginaActual < 1) this.paginaActual = 1;
    if (this.paginaActual > this.totalPaginas) this.paginaActual = this.totalPaginas;
  }

  onFiltroNombreListaChange() {
    this.paginaActual = 1;
  }

  trackById(index: number, item: ListaJuego): number {
    return item.id;
  }
}
