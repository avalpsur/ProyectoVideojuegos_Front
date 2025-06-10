import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ListaJuegosService, ListaJuego } from '../../core/services/lista-juegos.service';
import { UsuarioService, Usuario } from '../../core/services/usuario.service';

@Component({
  selector: 'app-lista-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-detalle.component.html',
  styleUrl: './lista-detalle.component.css'
})
export class ListaDetalleComponent implements OnInit {
  lista: ListaJuego | null = null;
  usuario: Usuario | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private listaService: ListaJuegosService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.listaService.obtenerListasDeUsuario(1).subscribe({ 
      next: listas => {
        this.lista = listas.find(l => l.id === id) || null;
        if (this.lista) {
          this.usuarioService.getAllUsuarios().subscribe({
            next: usuarios => {
              this.usuario = usuarios.find(u => u.id === this.lista!.usuarioId) || null;
              this.loading = false;
            },
            error: () => { this.loading = false; this.error = 'Error cargando usuario'; }
          });
        } else {
          this.loading = false;
          this.error = 'Lista no encontrada';
        }
      },
      error: () => { this.loading = false; this.error = 'Error cargando lista'; }
    });
  }
}
