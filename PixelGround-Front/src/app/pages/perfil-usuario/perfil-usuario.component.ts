import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../core/services/usuario.service';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {
  usuario: Usuario | null = null;
  error: string | null = null;
  cargando = true;
  esAmigo = false;
  esPropioPerfil = false;
  modal = { visible: false, mensaje: '' };
  listasCreadas = 3; // Mock
  ultimasResenas = [
    { juego: 'Celeste', texto: '¡Obra maestra!', fecha: '2025-06-01' },
    { juego: 'Hollow Knight', texto: 'Metroidvania top.', fecha: '2025-05-20' }
  ];

  steamJuegos: any[] = [];
  steamJuegosPagina: any[] = [];
  cargandoSteam = false;
  steamError: string | null = null;
  steamPagina = 1;
  steamPorPagina = 8;
  get steamTotalPaginas() {
    return Math.ceil(this.steamJuegos.length / this.steamPorPagina) || 1;
  }

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

 ngOnInit(): void {
  const nombreUsuario = this.route.snapshot.paramMap.get('nombreUsuario');
  const token = localStorage.getItem('token');

  if (nombreUsuario) {
    this.cargarUsuarioPorNombre(nombreUsuario);
  } else if (token) {
    this.cargarMiPerfil(token);
  } else {
    this.error = 'Usuario no especificado.';
    this.cargando = false;
  }
}

cargarMiPerfil(token: string) {
  const headers = { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  this.http.get<Usuario>('${environment.apiUrl}/usuarios/perfil', headers).subscribe({
    next: usuario => {
      this.usuario = usuario;
      this.esPropioPerfil = true;
      this.verificarAmistad();
      this.cargando = false;
      this.cargarSteamJuegos();
    },
    error: () => {
      this.error = 'No se pudo obtener tu perfil.';
      this.cargando = false;
    }
  });
}

cargarUsuarioPorNombre(nombreUsuario: string) {
  this.cargando = true;
  const token = localStorage.getItem('token');
  const headers = token ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) } : {};
  this.http.get<Usuario>(`${environment.apiUrl}/usuarios/username/${nombreUsuario}`, headers)
    .subscribe({
      next: usuario => {
        this.usuario = usuario;
        this.verificarPropioPerfil();
        this.verificarAmistad();
        this.cargando = false;
        this.cargarSteamJuegos();
      },
      error: () => {
        this.error = 'Usuario no encontrado.';
        this.cargando = false;
      }
    });
}

cargarSteamJuegos() {
  if (!this.usuario?.steamId) return;
  this.cargandoSteam = true;
  this.steamError = null;
  const token = localStorage.getItem('token');
  const headers = { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  this.http.get<any[]>('${environment.apiUrl}/usuarios/steam/juegos', headers).subscribe({
    next: juegos => {
      this.steamJuegos = juegos;
      this.steamPagina = 1;
      this.actualizarSteamPagina();
      this.cargandoSteam = false;
    },
    error: () => {
      this.steamError = 'No se han podido cargar tus juegos de Steam.';
      this.cargandoSteam = false;
    }
  });
}

actualizarSteamPagina() {
  const start = (this.steamPagina - 1) * this.steamPorPagina;
  const end = start + this.steamPorPagina;
  this.steamJuegosPagina = this.steamJuegos.slice(start, end);
}

cambiarSteamPagina(delta: number) {
  const nueva = this.steamPagina + delta;
  if (nueva < 1 || nueva > this.steamTotalPaginas) return;
  this.steamPagina = nueva;
  this.actualizarSteamPagina();
}

imgError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = 'assets/no-image.png';
}

  verificarPropioPerfil() {
    const actual = localStorage.getItem('usuario');
    if (actual && this.usuario) {
      const yo = JSON.parse(actual);
      this.esPropioPerfil = yo.nombreUsuario === this.usuario.nombreUsuario;
    }
  }

  verificarAmistad() {
    if (!this.usuario || this.esPropioPerfil) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    const headers = { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
    this.http.get<any[]>(`${environment.apiUrl}/amistades/amigos`, headers)
      .subscribe(amigos => {
        this.esAmigo = amigos.some(a => a.nombreUsuario === this.usuario?.nombreUsuario);
      });
  }

  enviarSolicitud() {
    if (!this.usuario) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    const headers = { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
    this.http.post('${environment.apiUrl}/amistades/solicitar', { receptor: this.usuario.id }, headers)
      .subscribe(() => {
        this.modal = { visible: true, mensaje: '¡Solicitud enviada con éxito!' };
      });
  }

  eliminarAmistad() {
    this.modal = { visible: true, mensaje: 'Amistad eliminada (mock).' };
    this.esAmigo = false;
  }

  cerrarModal() {
    this.modal.visible = false;
  }
}
