import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ListaJuegosService, ListaJuego } from '../../core/services/lista-juegos.service';
import { UsuarioService, Usuario } from '../../core/services/usuario.service';
import { RawgApiService } from '../../core/services/rawg-api.service';
import { AuthService } from '../../core/services/auth.service';
import { LucideIconsModule } from '../../shared/lucide.module';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-lista-detalle',
  standalone: true,
  imports: [CommonModule, LucideIconsModule, FormsModule, RouterModule],
  templateUrl: './lista-detalle.component.html',
  styleUrl: './lista-detalle.component.css'
})
export class ListaDetalleComponent implements OnInit {
  lista: ListaJuego | null = null;
  usuario: Usuario | null = null;
  usuarioId: number | null = null;
  loading = true;
  error = '';
  puedeUnirse = false;
  puedeGestionar = false;
  puedeEliminarJuego = false;
  showAddGameModal = false;
  juegos: any[] = []; 
  juegosRAWG: any[] = [];
  queryRAWG = '';
  selectedRAWG: any = null;
  addGameLoading = false;
  addGameError = '';

  paginaActualJuegos: number = 1;
  elementosPorPaginaJuegos: number = 6;
  filtroNombreJuego: string = '';

  constructor(
    private route: ActivatedRoute,
    private listaService: ListaJuegosService,
    private usuarioService: UsuarioService,
    private rawgApiService: RawgApiService,
    private authService: AuthService,
    public router: Router
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.obtenerPerfil(token).subscribe({
        next: (perfil) => {
          this.usuarioId = perfil.id;
          this.cargarLista(id);
        },
        error: () => {
          this.cargarLista(id);
        }
      });
    } else {
      this.cargarLista(id);
    }
  }

  cargarLista(id: number) {
    this.loading = true;
    this.listaService.obtenerListaPorId(id).subscribe({
      next: (lista) => {
        this.lista = lista;
        this.juegos = [];

        for (const apiId of lista.juegosId) {
          this.rawgApiService.obtenerJuegoPorId(Number(apiId)).subscribe({
            next: (juego) => {
              this.juegos.push({
                apiId: juego.id,
                nombre: juego.name,
                imagenUrl: juego.background_image,
                slug: juego.slug,
                rating: juego.rating
              });
            },
            error: (err) => console.error(`Error al cargar juego ${apiId}`, err)
          });
        }

        this.usuarioService.getAllUsuarios().subscribe({
          next: usuarios => {
            this.usuario = usuarios.find(u => u.id === lista.usuarioId) || null;
            this.loading = false;
            this.evaluarPermisos();
          },
          error: () => {
            this.loading = false;
            this.error = 'Error cargando usuario';
          }
        });
      },
      error: () => {
        this.loading = false;
        this.error = 'Error cargando lista';
      }
    });
  }

  evaluarPermisos() {
    if (!this.lista || !this.usuarioId) return;
    this.puedeUnirse = this.lista.publica && this.usuarioId !== this.lista.usuarioId && !this.lista.miembrosId.includes(this.usuarioId);
    this.puedeGestionar = this.usuarioId === this.lista.usuarioId || this.lista.miembrosId.includes(this.usuarioId);
    this.puedeEliminarJuego = this.puedeGestionar;
  }

  unirseALista() {
    if (!this.lista) return;
    this.listaService.unirseALista(this.lista.id).subscribe({
      next: () => {
        if (this.usuarioId != null) {
          this.lista!.miembrosId.push(this.usuarioId);
          this.evaluarPermisos();
        }
      },
      error: () => alert('Error al unirse a la lista')
    });
  }

  abrirModalAnadirJuego() {
    this.showAddGameModal = true;
    this.juegosRAWG = [];
    this.queryRAWG = '';
    this.selectedRAWG = null;
    this.addGameError = '';
  }

  buscarJuegosRAWG() {
    if (!this.queryRAWG.trim()) return;
    this.rawgApiService.buscarJuegos(this.queryRAWG).subscribe({
      next: (res) => this.juegosRAWG = res.results,
      error: () => this.addGameError = 'Error buscando juegos en RAWG'
    });
  }

  seleccionarJuegoRAWG(juego: any) {
    this.selectedRAWG = juego;
  }

  anadirJuegoALista() {
    if (!this.lista || !this.selectedRAWG) return;
    this.addGameLoading = true;
    this.listaService.anadirJuegoALista(this.lista.id, {
      apiId: this.selectedRAWG.id,
      nombre: this.selectedRAWG.name
    }).subscribe({
      next: () => {
        this.juegos.push({
          apiId: this.selectedRAWG.id,
          nombre: this.selectedRAWG.name,
          imagenUrl: this.selectedRAWG.background_image
        });
        this.showAddGameModal = false;
        this.addGameLoading = false;
      },
      error: () => {
        this.addGameError = 'Error al añadir juego';
        this.addGameLoading = false;
      }
    });
  }

  eliminarJuegoDeLista(juego: any) {
    if (!this.lista) return;
    this.listaService.eliminarJuegoDeLista(this.lista.id, juego.apiId).subscribe({
      next: () => {
        this.juegos = this.juegos.filter(j => j.apiId !== juego.apiId);
      },
      error: () => alert('Error al eliminar juego de la lista')
    });
  }

  cerrarModalAnadirJuego() {
    this.showAddGameModal = false;
  }

  get juegosFiltrados(): any[] {
    if (!this.filtroNombreJuego.trim()) return this.juegos;
    const filtro = this.filtroNombreJuego.trim().toLowerCase();
    return this.juegos.filter(j => j.nombre.toLowerCase().includes(filtro));
  }

  get juegosPaginados(): any[] {
    const inicio = (this.paginaActualJuegos - 1) * this.elementosPorPaginaJuegos;
    return this.juegosFiltrados.slice(inicio, inicio + this.elementosPorPaginaJuegos);
  }

  get totalPaginasJuegos(): number {
    return Math.max(1, Math.ceil(this.juegosFiltrados.length / this.elementosPorPaginaJuegos));
  }

  cambiarPaginaJuegos(delta: number) {
    this.paginaActualJuegos += delta;
    if (this.paginaActualJuegos < 1) this.paginaActualJuegos = 1;
    if (this.paginaActualJuegos > this.totalPaginasJuegos) this.paginaActualJuegos = this.totalPaginasJuegos;
  }

  onFiltroNombreJuegoChange() {
    this.paginaActualJuegos = 1;
  }
}
