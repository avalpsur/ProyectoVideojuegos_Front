import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { ExplorarComponent } from './pages/explorar/explorar.component';
import { MisJuegosComponent } from './pages/mis-juegos/mis-juegos.component';
import { AmistadComponent } from './pages/amistad/amistad.component';
import { ChatComponent } from './pages/chat/chat.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'explorar', component: ExplorarComponent },
  { path: 'mis-juegos', component: MisJuegosComponent },
  { path: 'amistad', component: AmistadComponent },
  { path: 'chat', component: ChatComponent },

];
