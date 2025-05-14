import { Component, OnInit, OnDestroy } from '@angular/core';
import { Client, IMessage, Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { HttpClient } from '@angular/common/http';

interface Usuario {
  id: number;
  nombreUsuario: string;
  email: string;
}

interface Mensaje {
  remitenteId: number;
  receptorId: number;
  contenido: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: true
})
export class ChatComponent implements OnInit, OnDestroy {
  cliente!: Client;
  mensajes: Mensaje[] = [];
  amigos: Usuario[] = [];
  mensaje: string = '';
  usuarioActual!: Usuario;
  amigoSeleccionado!: Usuario;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.usuarioActual = JSON.parse(localStorage.getItem('usuario')!);
    this.cargarAmigos();
    this.conectarWebSocket();
  }

  ngOnDestroy(): void {
    this.cliente?.deactivate();
  }

  cargarAmigos() {
    this.http.get<Usuario[]>(`/api/amistades/amigos/${this.usuarioActual.id}`).subscribe(data => {
      this.amigos = data;
    });
  }

  conectarWebSocket() {
    this.cliente = Stomp.over(() => new SockJS('/ws'));
    this.cliente.connect({}, () => {
      this.cliente.subscribe(`/user/${this.usuarioActual.id}/queue/messages`, (msg: IMessage) => {
        const recibido: Mensaje = JSON.parse(msg.body);
        if (this.amigoSeleccionado?.id === recibido.remitenteId) {
          this.mensajes.push(recibido);
        }
      });
    });
  }

  seleccionarAmigo(amigo: Usuario) {
    this.amigoSeleccionado = amigo;
    this.mensajes = []; // Puedes cargar historial si lo implementas en backend
  }

  enviarMensaje() {
    if (!this.mensaje.trim()) return;

    const nuevo: Mensaje = {
      remitenteId: this.usuarioActual.id,
      receptorId: this.amigoSeleccionado.id,
      contenido: this.mensaje
    };

    this.mensajes.push(nuevo);
    this.cliente.publish({
      destination: '/app/chat',
      body: JSON.stringify(nuevo)
    });

    this.mensaje = '';
  }
}

