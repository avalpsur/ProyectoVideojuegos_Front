import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ForoService } from '../../core/services/foro.service';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hilos-foro',
  templateUrl: './hilos-foro.component.html',
  imports: [CommonModule, FormsModule],
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

  rol: string = '';
  nombreUsuario: string = '';
  avatar: string = '';

  mostrarFormularioCrearHilo = false;
  nuevoHilo = { titulo: '', contenido: '' };

  constructor(
    private foroService: ForoService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.obtenerPerfil(token).subscribe({
        next: (usuario) => {
          this.nombreUsuario = usuario.nombreUsuario;
          this.avatar = usuario.avatar || '';
          this.rol = usuario.rol;
        },
        error: (err) => {
          console.error('Error al obtener perfil:', err);
        }
      });
    }

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

    this.cargarHilos();
  }

  cargarHilos(): void {
    this.foroService.getHilosPorTema(this.temaId).subscribe({
      next: hilos => {
        this.hilos = hilos;
        this.totalHilos = hilos.length;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los hilos.';
        this.cargando = false;
      }
    });
  }

  crearHilo(): void {
    const { titulo, contenido } = this.nuevoHilo;
    this.foroService.crearHilo(this.temaId, titulo, contenido).subscribe({
      next: () => {
        this.mostrarFormularioCrearHilo = false;
        this.nuevoHilo = { titulo: '', contenido: '' };
        this.cargarHilos();
      },
      error: () => alert('Error al crear el hilo.')
    });
  }

  eliminarHilo(hilo: any): void {
    if (confirm(`¿Eliminar el hilo "${hilo.titulo}"?`)) {
      this.foroService.eliminarHilo(hilo.id).subscribe(() => this.cargarHilos());
    }
  }

  irAHilo(hilo: any) {
    this.router.navigate(['/foro/hilo', hilo.id]);
  }

  volverATemas() {
    this.router.navigate(['/foro']);
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
}
