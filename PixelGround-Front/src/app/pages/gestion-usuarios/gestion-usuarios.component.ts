import { Component, OnInit } from '@angular/core';
import { UsuarioService, Usuario } from '../../core/services/usuario.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.scss']
})
export class GestionUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  paginaActual = 1;
  usuariosPorPagina = 5;
  totalPaginas = 1;
  usuarioEditando: Usuario | null = null;
  mostrarModal = false;
  nuevoRol = '';
  usuarioAEliminar: Usuario | null = null;
  mostrarConfirmacion = false;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    // TODO: Implementar paginación real en el backend si es posible
    const token = localStorage.getItem('token');
    fetch('http://localhost:8080/api/usuarios', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then((data: Usuario[]) => {
        this.usuarios = data;
        this.totalPaginas = Math.ceil(this.usuarios.length / this.usuariosPorPagina);
      });
  }

  get usuariosPaginados() {
    const inicio = (this.paginaActual - 1) * this.usuariosPorPagina;
    return this.usuarios.slice(inicio, inicio + this.usuariosPorPagina);
  }

  cambiarPagina(delta: number) {
    this.paginaActual += delta;
    if (this.paginaActual < 1) this.paginaActual = 1;
    if (this.paginaActual > this.totalPaginas) this.paginaActual = this.totalPaginas;
  }

  abrirModal(usuario: Usuario) {
    this.usuarioEditando = usuario;
    this.nuevoRol = usuario.rol;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.usuarioEditando = null;
  }

  guardarRol() {
    if (!this.usuarioEditando) return;
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8080/api/usuarios/${this.usuarioEditando.id}/cambiar-rol`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ nuevoRol: this.nuevoRol })
    })
      .then(() => {
        this.usuarioEditando!.rol = this.nuevoRol;
        this.cerrarModal();
      });
  }

  confirmarEliminar(usuario: Usuario) {
    this.usuarioAEliminar = usuario;
    this.mostrarConfirmacion = true;
  }

  cancelarEliminar() {
    this.usuarioAEliminar = null;
    this.mostrarConfirmacion = false;
  }

  eliminarUsuario() {
    if (!this.usuarioAEliminar) return;
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8080/api/usuarios/${this.usuarioAEliminar.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(() => {
        this.usuarios = this.usuarios.filter(u => u.id !== this.usuarioAEliminar!.id);
        this.cancelarEliminar();
        this.totalPaginas = Math.ceil(this.usuarios.length / this.usuariosPorPagina);
        if (this.paginaActual > this.totalPaginas) this.paginaActual = this.totalPaginas;
      });
  }
}
