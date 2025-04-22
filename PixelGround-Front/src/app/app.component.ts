import { Component, signal, computed } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { MenuComponent } from './core/menu/menu.component';
import { FooterComponent } from './core/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent, FooterComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'angular-standalone';
  private currentUrl = signal('');

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl.set(event.urlAfterRedirects);
      });
  }

  mostrarMenu = computed(() => {
    const url = this.currentUrl();
    return !url.includes('/login') && !url.includes('/registro');
  });
}


