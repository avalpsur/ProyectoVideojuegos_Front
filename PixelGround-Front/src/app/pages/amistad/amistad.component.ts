import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AmistadService } from '../../core/services/amistad.service';
import { UsuarioService, Usuario } from '../../core/services/usuario.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

export interface UsuarioBusqueda extends Usuario {
  avatar?: string;
  solicitudEnviada?: boolean;
}

@Component({
  selector: 'app-amistad',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './amistad.component.html'
})
export class AmistadComponent implements OnInit {
  usuario: any;
  solicitudesPendientes: any[] = [];
  amigos: any[] = [];
  usuarioBuscado = '';
  resultadosBusqueda: UsuarioBusqueda[] = [];
  modal: { visible: boolean, mensaje: string } = { visible: false, mensaje: '' };
  buscando = false;

  constructor(
    private amistadService: AmistadService,
    private usuarioService: UsuarioService,
    private http: HttpClient, 
    private router: Router
  ) { }

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.cargarSolicitudes();
    this.cargarAmigos();
  }

  buscarUsuarios(): void {
    const nombre = this.usuarioBuscado.trim();
    if (!nombre) {
      this.resultadosBusqueda = [];
      return;
    }

    this.buscando = true;

    this.usuarioService.buscarUsuariosPorNombreParcial(nombre).subscribe(
      usuarios => {
        this.resultadosBusqueda = usuarios
          .filter(u => u.id !== this.usuario.id && !this.amigos.some(a => a.id === u.id))
          .map(u => ({ ...u }));
        this.buscando = false;
      },
      () => (this.buscando = false)
    );
  }



  cargarSolicitudes(): void {
    this.amistadService.obtenerSolicitudes().subscribe({
      next: res => this.solicitudesPendientes = res,
      error: err => console.error('Error al cargar solicitudes:', err)
    });
  }

  cargarAmigos(): void {
    this.amistadService.obtenerAmigos().subscribe({
      next: res => this.amigos = res,
      error: err => console.error('Error al cargar amigos:', err)
    });
  }

  enviarSolicitud(receptorId: number): void {
    this.amistadService.enviarSolicitud(receptorId).subscribe({
      next: () => {
        this.modal = { visible: true, mensaje: '¡Solicitud enviada con éxito!' };
        this.resultadosBusqueda = this.resultadosBusqueda.map(u =>
          u.id === receptorId ? { ...u, solicitudEnviada: true } : u
        );
        this.cargarSolicitudes();
      },
      error: err => console.error('Error al enviar solicitud:', err)
    });
  }

  aceptarSolicitud(solicitanteId: number): void {
    this.amistadService.aceptarSolicitud(solicitanteId).subscribe({
      next: () => {
        this.cargarSolicitudes();
        this.cargarAmigos();
      },
      error: err => console.error('Error al aceptar solicitud:', err)
    });
  }

  rechazarSolicitud(solicitanteId: number): void {
    this.amistadService.rechazarSolicitud(solicitanteId).subscribe({
      next: () => this.cargarSolicitudes(),
      error: err => console.error('Error al rechazar solicitud:', err)
    });
  }

  cerrarModal(): void {
    this.modal.visible = false;
  }
}
