import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.component.html'
})
export class RegistroComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.registerForm = this.fb.group({
      email: [''],
      nombreUsuario: [''],
      password: ['']
    });
  }

  onSubmit() {
    const user = this.registerForm.value;

    this.http.post('http://localhost:8080/api/usuarios/registro', user).subscribe({
      next: () => {
        alert('Usuario registrado correctamente');
        this.router.navigate(['/home']);
      },
      error: () => {
        alert('Error al registrar el usuario');
      }
    });
  }
}
