import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ForoService } from '../../core/services/foro.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-temas-foro',
  templateUrl: './temas-foro.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./temas-foro.component.css']
})
export class TemasForoComponent implements OnInit {
  temas: any[] = [];
  cargando = false;
  error = '';
  rol: string = '';
  nombreUsuario: string = '';
  avatar: string = '';
  mostrarFormularioCrearTema: boolean = false;

  nuevoTema = {
    nombre: '',
    descripcion: ''
  };


  constructor(private foroService: ForoService, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.cargando = true;

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

    this.cargarTemas();
  }



  irATema(tema: any) {
    this.router.navigate(['/foro/tema', tema.id]);
  }
  cargarTemas(): void {
    this.cargando = true;
    this.foroService.getTemas().subscribe({
      next: temas => {
        this.temas = temas;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los temas.';
        this.cargando = false;
      }
    });
  }


  crearTema(): void {
    const { nombre, descripcion } = this.nuevoTema;
    this.foroService.crearTema(nombre, descripcion).subscribe({
      next: () => {
        this.mostrarFormularioCrearTema = false;
        this.nuevoTema = { nombre: '', descripcion: '' };
        this.cargarTemas();
      },
      error: () => {
        alert('Error al crear el tema.');
      }
    });
  }


}
