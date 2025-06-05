import { Component, OnInit } from '@angular/core';
import { ActividadService } from '../../core/services/actividad.service';
import { Actividad } from '../../core/models/actividad.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  actividades: Actividad[] = [];
  cargando = true;
  nombreUsuario = '...';

  constructor(private actividadService: ActividadService) {}

  ngOnInit(): void {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.nombreUsuario = usuario.nombreUsuario || '...';

    this.actividadService.obtenerFeed().subscribe({
      next: (res: Actividad[]) => {
        this.actividades = res;
        this.cargando = false;
      },
      error: () => (this.cargando = false),
    });
  }

  extraerPuntuacion(contenidoExtra: string): string {
    try {
      const obj = JSON.parse(contenidoExtra);
      return obj.puntuacion?.toFixed(1) ?? 'N/A';
    } catch {
      return contenidoExtra?.length < 10 ? contenidoExtra : 'N/A';
    }
  }

  isImagenValida(url: string): boolean {
    return !!url && url !== 'URL vacía';
  }
}
