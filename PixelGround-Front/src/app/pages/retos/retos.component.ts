import { Component, OnInit } from '@angular/core';
import { RetosService, Reto, ParticipanteReto } from '../../core/services/retos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-retos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './retos.component.html',
  styleUrl: './retos.component.css'
})
export class RetosComponent implements OnInit {
  retosTodos: Reto[] = [];
  retosActivos: Reto[] = [];
  misParticipaciones: ParticipanteReto[] = [];
  usuarioId: number = 0;
  tabSeleccionada: 'todos' | 'activos' | 'mis' = 'todos';
  busqueda: string = '';
  retoSeleccionado: Reto | null = null;
  mostrarModalDetalle = false;
  retoDetalleSeleccionado: any = null;
  mostrarInscripcionExitosa: boolean = false;



  mostrarModalUnirse: boolean = false;

  constructor(private retosService: RetosService, private authService: AuthService) { }

  ngOnInit(): void {
    this.obtenerUsuario();
  }

  obtenerUsuario() {
    const token = localStorage.getItem('token');
    if (!token) return;
    this.authService.obtenerPerfil(token).subscribe({
      next: (usuario) => {
        this.usuarioId = usuario.id;
        this.cargarRetos();
      }
    });
  }

  cargarRetos() {
    if (this.tabSeleccionada === 'todos') {
      this.retosService.getTodosLosRetos().subscribe({
        next: (retos) => this.retosTodos = retos
      });
    } else if (this.tabSeleccionada === 'activos') {
      this.retosService.getRetosActivos().subscribe({
        next: (retos) => this.retosActivos = retos
      });
    } else if (this.tabSeleccionada === 'mis') {
      this.retosService.getRetosPorUsuario(this.usuarioId).subscribe({
        next: (participaciones) => this.misParticipaciones = participaciones
      });
    }
  }

  cambiarTab(tab: 'todos' | 'activos' | 'mis') {
    this.tabSeleccionada = tab;
    this.cargarRetos();
  }

  // Devuelve true si la pestaña seleccionada es 'mis'
  isTabMis(): boolean {
    return this.tabSeleccionada === 'mis';
  }

  // Getter para retos filtrados (solo para 'todos' y 'activos')
  get retosFiltrados(): Reto[] {
    let lista = this.tabSeleccionada === 'activos' ? this.retosActivos : this.retosTodos;
    if (this.busqueda.trim()) {
      lista = lista.filter(r =>
        r.titulo.toLowerCase().includes(this.busqueda.trim().toLowerCase()) ||
        r.juego.toLowerCase().includes(this.busqueda.trim().toLowerCase())
      );
    }
    return lista;
  }

  // Getter para mis retos (ParticipanteReto[])
  get misRetos(): ParticipanteReto[] {
    if (this.tabSeleccionada === 'mis') {
      if (this.busqueda.trim()) {
        return this.misParticipaciones.filter(p =>
          p.tituloReto.toLowerCase().includes(this.busqueda.trim().toLowerCase())
        );
      }
      return this.misParticipaciones;
    }
    return [];
  }

  // Método para el template
  esRetoActivo(reto: Reto): boolean {
    const hoy = new Date();
    const inicio = new Date(reto.fechaInicio);
    const fin = new Date(reto.fechaExpiracion);
    return hoy >= inicio && hoy <= fin;
  }

  unirseAReto(reto: Reto): void {
    const participacion: ParticipanteReto = {
      usuarioId: this.usuarioId,
      nombreUsuario: '',
      retoId: reto.id!,           // 👈 el fix aquí
      tituloReto: reto.titulo,
      comentario: '',
      imagenPruebaUrl: null,
      completado: false,
      fechaCompletado: null
    };

    this.retosService.unirseAReto(participacion).subscribe({
      next: (nuevaParticipacion) => {
        this.misParticipaciones.push(nuevaParticipacion);

        if (this.tabSeleccionada === 'mis') {
          this.misParticipaciones = [...this.misParticipaciones]; 
        }

        this.mostrarInscripcionExitosa = true;
        setTimeout(() => this.mostrarInscripcionExitosa = false, 3000);
      },
      error: (err) => {
        console.error('Error al unirse al reto:', err);
      }
    });

  }



  cerrarModalUnirse() {
    this.mostrarModalUnirse = false;
  }

  abrirDetalleReto(reto: any): void {
    this.retoDetalleSeleccionado = reto;
  }

  cerrarModalDetalle(): void {
    this.retoDetalleSeleccionado = null;
  }
  isReto(reto: any): boolean {
    return reto.hasOwnProperty('juego') && reto.hasOwnProperty('descripcion');
  }

  estaInscrito(reto: Reto): boolean {
    return this.misParticipaciones.some(p => p.retoId === reto.id);
  }

}
