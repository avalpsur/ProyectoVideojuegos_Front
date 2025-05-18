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
  usuario: any;
  solicitudesPendientes: any[] = [];
  amigos: any[] = [];
  usuarioBuscado = '';

  constructor(private amistadService: AmistadService) {}

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.cargarSolicitudes();
    this.cargarAmigos();
  }

  cargarSolicitudes(): void {
    this.amistadService.obtenerSolicitudes().subscribe((data: any[]) => {
      this.solicitudesPendientes = data;
    });
  }

  cargarAmigos(): void {
    this.amistadService.obtenerAmigos().subscribe((data: any[]) => {
      this.amigos = data;
    });
  }

  enviarSolicitud(): void {
    const receptorId = Number(this.usuarioBuscado);
    if (!receptorId || receptorId === this.usuario?.id) return;

    this.amistadService.enviarSolicitud(receptorId).subscribe(() => {
      alert('Solicitud enviada');
      this.usuarioBuscado = '';
    });
  }

  aceptarSolicitud(solicitanteId: number): void {
    this.amistadService.aceptarSolicitud(solicitanteId).subscribe(() => {
      this.cargarSolicitudes();
      this.cargarAmigos();
    });
  }

  rechazarSolicitud(solicitanteId: number): void {
    this.amistadService.rechazarSolicitud(solicitanteId).subscribe(() => {
      this.cargarSolicitudes();
    });
  }
}
