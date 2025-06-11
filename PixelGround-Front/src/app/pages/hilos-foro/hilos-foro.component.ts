import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ForoService } from '../../core/services/foro.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hilos-foro',
  templateUrl: './hilos-foro.component.html',
  imports: [CommonModule],
  styleUrls: ['./hilos-foro.component.css']
})
export class HilosForoComponent implements OnInit {
  temaId: number = 0;
  tema: any = null;
  hilos: any[] = [];
  cargando = false;
  error = '';
  pagina = 1;
  pageSize = 10;
  totalHilos = 0;

  constructor(private foroService: ForoService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.temaId = +params['id'];
      this.cargarTemaYHilos();
    });
  }

  cargarTemaYHilos() {
    this.cargando = true;
    this.foroService.getTemas().subscribe({
      next: temas => {
        this.tema = temas.find((t: any) => t.id === this.temaId);
      }
    });
    this.foroService.getHilosPorTema(this.temaId).subscribe({
      next: hilos => {
        this.totalHilos = hilos.length;
        this.hilos = hilos;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los hilos.';
        this.cargando = false;
      }
    });
  }

  irAHilo(hilo: any) {
    this.router.navigate(['/foro/hilo', hilo.id]);
  }

  cambiarPagina(delta: number) {
    const nueva = this.pagina + delta;
    if (nueva < 1 || nueva > this.totalPaginas) return;
    this.pagina = nueva;
  }

  get totalPaginas() {
    return Math.ceil(this.totalHilos / this.pageSize) || 1;
  }

  get hilosPagina() {
    const start = (this.pagina - 1) * this.pageSize;
    return this.hilos.slice(start, start + this.pageSize);
  }

  volverATemas() {
    this.router.navigate(['/foro']);
  }
}
