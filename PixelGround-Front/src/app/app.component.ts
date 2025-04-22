import { Component, signal, effect, computed, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuComponent } from './core/menu/menu.component';
import { FooterComponent } from './core/footer/footer.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-frontend';

  router = inject(Router);
  currentUrl = signal(this.router.url);

  mostrarMenu = computed(() => {
    const url = this.currentUrl();
    return !(url === '/login' || url === '/registro');
  });

  constructor() {
    effect(() => {
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(event => {
          this.currentUrl.set((event as NavigationEnd).urlAfterRedirects);
        });
    });
  }
}

