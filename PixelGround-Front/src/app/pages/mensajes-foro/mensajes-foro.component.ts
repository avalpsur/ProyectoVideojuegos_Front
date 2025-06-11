import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ForoService } from '../../core/services/foro.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mensajes-foro',
  templateUrl: './mensajes-foro.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./mensajes-foro.component.css']
})
export class MensajesForoComponent implements OnInit {
  hiloId: number = 0;
  hilo: any = null;
  respuestas: any[] = [];
  cargando = false;
  error = '';
  pagina = 1;
  pageSize = 10;
  totalRespuestas = 0;
  nuevaRespuesta = '';

  constructor(private foroService: ForoService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.hiloId = +params['id'];
      this.cargarHiloYRespuestas();
    });
  }

  cargarHiloYRespuestas() {
    this.cargando = true;
    this.foroService.getHiloPorId(this.hiloId).subscribe({
      next: (hilo) => {
        this.hilo = hilo;
        this.foroService.getRespuestasHilo(this.hiloId).subscribe({
          next: (respuestas) => {
            this.respuestas = respuestas;
            this.totalRespuestas = respuestas.length;
            this.cargando = false;
          },
          error: () => {
            this.error = 'Error al cargar respuestas.';
            this.cargando = false;
          }
        });
      },
      error: () => {
        this.error = 'Hilo no encontrado.';
        this.cargando = false;
      }
    });
  }

  get respuestasPagina() {
    const start = (this.pagina - 1) * this.pageSize;
    return this.respuestas.slice(start, start + this.pageSize);
  }

  get totalPaginas() {
    return Math.ceil(this.totalRespuestas / this.pageSize) || 1;
  }

  cambiarPagina(delta: number) {
    const nueva = this.pagina + delta;
    if (nueva < 1 || nueva > this.totalPaginas) return;
    this.pagina = nueva;
  }

  responder() {
    if (!this.nuevaRespuesta.trim()) return;
    this.foroService.responderHilo(this.hiloId, this.nuevaRespuesta).subscribe({
      next: () => {
        this.nuevaRespuesta = '';
        this.cargarHiloYRespuestas(); 
      },
      error: () => this.error = 'No se pudo responder.'
    });
  }

  volverAHilos() {
    this.router.navigate(['/foro/tema', this.hilo?.temaId || 1]);
  }
}
