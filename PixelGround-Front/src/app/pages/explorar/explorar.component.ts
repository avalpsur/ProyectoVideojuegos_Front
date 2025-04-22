import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RawgApiService } from '../../core/services/rawg-api.service';

@Component({
  selector: 'app-explorar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './explorar.component.html',
  styleUrls: ['./explorar.component.css']
})
export class ExplorarComponent {
  query = '';
  resultados: any[] = [];
  generos: any[] = [];
  plataformas: any[] = [];

  filtroGenero: string = '';
  filtroPlataforma: string = '';


  constructor(private rawgService: RawgApiService) { }


  ngOnInit(): void {
    this.rawgService.obtenerJuegosPopulares().subscribe({
      next: (res) => this.resultados = res.results,
      error: (err) => console.error('Error al cargar juegos populares:', err),
    });
  
    this.rawgService.getGeneros().subscribe({
      next: (res) => this.generos = res.results,
      error: (err) => console.error('Error al cargar géneros:', err),
    });
  
    this.rawgService.getPlataformas().subscribe({
      next: (res) => this.plataformas = res.results,
      error: (err) => console.error('Error al cargar plataformas:', err),
    });
  }
  

  buscar() {
    if (!this.query.trim()) return;

    this.rawgService.buscarJuegos(this.query).subscribe({
      next: (res) => this.resultados = res.results,
      error: (err) => console.error('Error al buscar juegos:', err),
    });
  }

}
