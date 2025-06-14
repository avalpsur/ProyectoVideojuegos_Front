import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { ExplorarComponent } from './pages/explorar/explorar.component';
import { MisJuegosComponent } from './pages/mis-juegos/mis-juegos.component';
import { AmistadComponent } from './pages/amistad/amistad.component';
import { ChatComponent } from './pages/chat/chat.component';
import { JuegoDetalleComponent } from './pages/juego-detalle/juego-detalle.component';
import { PerfilUsuarioComponent } from './pages/perfil-usuario/perfil-usuario.component';
import { GestionUsuariosComponent } from './pages/gestion-usuarios/gestion-usuarios.component';
import { RetosComponent } from './pages/retos/retos.component';
import { ListaDetalleComponent } from './pages/lista-detalle/lista-detalle.component';
import { SteamCallbackComponent } from './pages/steam-callback/steam-callback.component';
import { MensajesForoComponent } from './pages/mensajes-foro/mensajes-foro.component';
import { TemasForoComponent } from './pages/temas-foro/temas-foro.component';
import { HilosForoComponent } from './pages/hilos-foro/hilos-foro.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'explorar', component: ExplorarComponent },
  { path: 'mis-juegos', component: MisJuegosComponent },
  { path: 'amistad', component: AmistadComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'juego/:id', component: JuegoDetalleComponent },
  { path: 'perfil/:nombreUsuario', component: PerfilUsuarioComponent },
  { path: 'perfil', component: PerfilUsuarioComponent }, 
  { path: 'gestion-usuarios', component: GestionUsuariosComponent },
  { path: 'retos', component: RetosComponent },
  { path: 'lista/:id', component: ListaDetalleComponent },
  { path: 'steam-callback', component: SteamCallbackComponent },
  { path: 'foro', component: TemasForoComponent },
  { path: 'foro/tema/:id', component: HilosForoComponent },
  { path: 'foro/hilo/:id', component: MensajesForoComponent },
];
