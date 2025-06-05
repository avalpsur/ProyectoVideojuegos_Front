import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AmistadService } from '../../core/services/amistad.service';
import { UsuarioService, Usuario } from '../../core/services/usuario.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface UsuarioBusqueda extends Usuario {
  avatar?: string; 
  solicitudEnviada?: boolean; 
}

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
  resultadosBusqueda: UsuarioBusqueda[] = [];
  modal: { visible: boolean, mensaje: string } = { visible: false, mensaje: '' };
  buscando = false;

  constructor(
    private amistadService: AmistadService,
    private usuarioService: UsuarioService,
    private http: HttpClient
  ) {}

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


  enviarSolicitud(receptorId: number): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.post('http://localhost:8080/api/amistades/solicitar', { receptor: receptorId }, { headers })
      .subscribe(() => {
        this.modal = { visible: true, mensaje: '¡Solicitud enviada con éxito!' };
        this.resultadosBusqueda = this.resultadosBusqueda.map(u => u.id === receptorId ? { ...u, solicitudEnviada: true } : u);
        this.cargarSolicitudes();
      });
  }

  aceptarSolicitud(solicitanteId: number): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.post('http://localhost:8080/api/amistades/aceptar', { solicitanteId }, { headers })
      .subscribe(() => {
        this.cargarSolicitudes();
        this.cargarAmigos();
      });
  }

  rechazarSolicitud(solicitanteId: number): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.post('http://localhost:8080/api/amistades/rechazar', { solicitanteId }, { headers })
      .subscribe(() => {
        this.cargarSolicitudes();
      });
  }

  cargarSolicitudes(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get<any[]>('http://localhost:8080/api/amistades/pendientes', { headers })
      .subscribe(data => {
        this.solicitudesPendientes = data;
      });
  }

  cargarAmigos(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get<any[]>('http://localhost:8080/api/amistades', { headers })
      .subscribe(data => {
        this.amigos = data;
      });
  }

  cerrarModal(): void {
    this.modal.visible = false;
  }
}
