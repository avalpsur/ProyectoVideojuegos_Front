import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaJuegosService, ListaJuego } from '../../core/services/lista-juegos.service';
import { decodeToken } from '../../core/helpers/jwt-helper';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mis-juegos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-juegos.component.html',
  styleUrls: ['./mis-juegos.component.css']
})
export class MisJuegosComponent implements OnInit {
  listas: ListaJuego[] = [];
  nombreLista: string = '';
  descripcionLista: string = '';
  usuarioId: number | null = null;

  constructor(private listaService: ListaJuegosService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const decoded = decodeToken(token);
    this.usuarioId = decoded?.id;

    if (this.usuarioId) {
      this.listaService.obtenerListasDeUsuario(this.usuarioId).subscribe({
        next: (listas) => this.listas = listas,
        error: (err) => console.error('Error al cargar listas', err),
      });
    }
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
  
  
}