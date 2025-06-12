import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LucideIconsModule } from '../../shared/lucide.module';
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideIconsModule],
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {
  nombreUsuario: string = '';
  avatar: string = '';
  rol: string = '';
  mostrarDropdown = false;

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
          this.rol = usuario.rol;
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
