import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListaJuegosService, ListaJuego } from '../../core/services/lista-juegos.service';
import { decodeToken } from '../../core/helpers/jwt-helper';
import { RawgApiService } from '../../core/services/rawg-api.service';

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
  selectedListId: number | null = null;
  newListName: string = '';
  newListDescription: string = '';
  filtroGenero: string = '';  
  filtroPlataforma: string = '';  
  generos: any[] = []; 
  plataformas: any[] = []; 

  constructor(
    private listaService: ListaJuegosService,
    private rawgService: RawgApiService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) return;
  
    const decoded = decodeToken(token);
    const usuarioId = decoded?.id;
  
    if (usuarioId) {
      this.listaService.obtenerListasDeUsuario(usuarioId).subscribe({
        next: (listas) => this.listas = listas,
        error: (err) => console.error('Error al cargar listas', err),
      });
    }
  
    this.rawgService.obtenerJuegosPopulares().subscribe({
      next: (data) => {
        this.resultados = data.results;
        console.log('Juegos populares cargados:', this.resultados);
      },
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
  
  

  toggleDropdown(juegoId: number): void {
    this.selectedJuegoId = this.selectedJuegoId === juegoId ? null : juegoId;
  }

  crearNuevaLista(): void {
    if (!this.newListName.trim()) return;

    const nuevaLista = {
      nombre: this.newListName,
      descripcion: this.newListDescription
    };

    this.listaService.crearLista(nuevaLista).subscribe({
      next: (nuevaListaCreada) => {
        this.listas.push(nuevaListaCreada);
        this.selectedListId = nuevaListaCreada.id;
      },
      error: (err) => {
        console.error('Error al crear lista', err);
      }
    });
  }

  anadirAJuegos(juego: any): void {
    if (!this.selectedListId) return;

    this.listaService.añadirJuegoALista(this.selectedListId, juego).subscribe({
      next: () => {
        console.log('Juego añadido a la lista');
        this.selectedJuegoId = null;
      },
      error: (err) => {
        console.error('Error al añadir juego', err);
      }
    });
  }
}
