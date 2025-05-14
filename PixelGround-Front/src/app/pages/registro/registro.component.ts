import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  registerForm: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      nombreUsuario: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    const { email, nombreUsuario, password } = this.registerForm.value;
  
    this.authService.register(email, nombreUsuario, password).subscribe({
      next: (token: string) => {
        localStorage.setItem('token', token);
  
        this.authService.obtenerPerfil(token).subscribe({
          next: (usuario) => {
            localStorage.setItem('usuario', JSON.stringify(usuario));
            this.router.navigate(['/home']);
          },
          error: () => {
            alert('Error al obtener perfil después de registrarse');
          }
        });
      },
      error: () => {
        alert('Error al registrar usuario');
      }
    });
  }  
  
}
