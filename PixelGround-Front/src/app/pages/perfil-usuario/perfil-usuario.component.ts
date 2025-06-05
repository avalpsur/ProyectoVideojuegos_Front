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
  this.http.get<Usuario>('http://localhost:8080/api/usuarios/perfil', headers).subscribe({
    next: usuario => {
      this.usuario = usuario;
      this.esPropioPerfil = true;
      this.verificarAmistad();
      this.cargando = false;
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
  this.http.get<Usuario>(`http://localhost:8080/api/usuarios/username/${nombreUsuario}`, headers)
    .subscribe({
      next: usuario => {
        this.usuario = usuario;
        this.verificarPropioPerfil();
        this.verificarAmistad();
        this.cargando = false;
      },
      error: () => {
        this.error = 'Usuario no encontrado.';
        this.cargando = false;
      }
    });
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
    this.http.get<any[]>(`http://localhost:8080/api/amistades/amigos`, headers)
      .subscribe(amigos => {
        this.esAmigo = amigos.some(a => a.nombreUsuario === this.usuario?.nombreUsuario);
      });
  }

  enviarSolicitud() {
    if (!this.usuario) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    const headers = { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
    this.http.post('http://localhost:8080/api/amistades/solicitar', { receptor: this.usuario.id }, headers)
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
