import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {
  nombreUsuario: string = '';
  avatar: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.obtenerPerfil(token).subscribe({
        next: (usuario) => {
          this.nombreUsuario = usuario.nombreUsuario;
          this.avatar = usuario.avatar || '';
        },
        error: (err) => {
          console.error('Error al obtener perfil:', err);
        }
      });
    }
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}
