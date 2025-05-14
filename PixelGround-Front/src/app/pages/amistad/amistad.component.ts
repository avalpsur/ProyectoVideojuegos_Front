import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AmistadService } from '../../core/services/amistad.service';

@Component({
  selector: 'app-amistad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './amistad.component.html'
})
export class AmistadComponent implements OnInit {
  usuarioId = 1; // Reemplaza con el ID del usuario logueado
  solicitudesPendientes: any[] = [];
  amigos: any[] = [];
  usuarioBuscado = '';

  constructor(private amistadService: AmistadService) {}

  ngOnInit(): void {
    this.cargarSolicitudes();
    this.cargarAmigos();
  }

  cargarSolicitudes(): void {
    this.amistadService.obtenerSolicitudes(this.usuarioId).subscribe((data: any[]) => {
      this.solicitudesPendientes = data;
    });
  }

  cargarAmigos(): void {
    this.amistadService.obtenerAmigos(this.usuarioId).subscribe((data: any[]) => {
      this.amigos = data;
    });
  }

  enviarSolicitud(): void {
    const receptorId = Number(this.usuarioBuscado);
    if (!receptorId) return;

    this.amistadService.enviarSolicitud(this.usuarioId, receptorId).subscribe(() => {
      alert('Solicitud enviada');
      this.usuarioBuscado = '';
    });
  }

  aceptarSolicitud(solicitanteId: number): void {
    this.amistadService.aceptarSolicitud(this.usuarioId, solicitanteId).subscribe(() => {
      this.cargarSolicitudes();
      this.cargarAmigos();
    });
  }

  rechazarSolicitud(solicitanteId: number): void {
    this.amistadService.rechazarSolicitud(this.usuarioId, solicitanteId).subscribe(() => {
      this.cargarSolicitudes();
    });
  }
}
