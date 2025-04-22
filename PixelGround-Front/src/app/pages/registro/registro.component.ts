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

  onSubmit(): void {
    if (this.registerForm.invalid) {
      console.warn('Formulario inválido:', this.registerForm.value);
      return;
    }
  
    const { email, nombreUsuario, password } = this.registerForm.value;
  
    this.authService.register(email, nombreUsuario, password).subscribe({
      next: () => {
        this.authService.login(email, password).subscribe({
          next: (token: string) => {
            localStorage.setItem('token', token);
            this.router.navigate(['/home']);
          },
          error: (err) => {
            console.error('Error al hacer login automático:', err);
          }
        });
      },
      error: (err) => {
        console.error('Error al registrar:', err);
      }
    });
  }
  
}
