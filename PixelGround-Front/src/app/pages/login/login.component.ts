import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      login: [''],
      password: ['']
    });
  }

  onSubmit() {
    const { login, password } = this.loginForm.value;
  
    this.authService.login(login, password).subscribe({
      next: (token: string) => {
        console.log('Token recibido:', token);
        localStorage.setItem('token', token);
  
        this.authService.obtenerPerfil(token).subscribe({
          next: (usuario) => {
            console.log('Usuario recibido:', usuario);
            localStorage.setItem('usuario', JSON.stringify(usuario));
            this.router.navigate(['/home']);
          },
          error: (err) => {
            console.error('Error en obtenerPerfil:', err);
            alert('Error al obtener perfil de usuario');
          }
        });
      },
      error: () => {
        alert('Login incorrecto');
      }
    });
  }
  
  
}
