import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ForoService } from '../../core/services/foro.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(private foroService: ForoService, private router: Router) {}

  ngOnInit() {
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

  irATema(tema: any) {
    this.router.navigate(['/foro/tema', tema.id]);
  }
}
