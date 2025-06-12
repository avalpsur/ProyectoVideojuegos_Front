import { Component, OnInit, OnDestroy } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ElementRef, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./chat.component.css'],
  standalone: true
})
export class ChatComponent implements OnInit, OnDestroy {
  cliente!: Client;
  usuarioActual: any = JSON.parse(localStorage.getItem('usuario')!);
  mensaje: string = '';
  mensajes: any[] = [];
  amigos: any[] = [];
  amigoSeleccionado: any;
  @ViewChild('chatMensajes') contenedorMensajes!: ElementRef;


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.cargarAmigos();
    this.conectarWebSocket();
  }

  ngOnDestroy(): void {
    this.cliente.deactivate();
  }

  ngAfterViewChecked() {
    this.scrollAlFinal();
  }

  private scrollAlFinal(): void {
    try {
      this.contenedorMensajes.nativeElement.scrollTop = this.contenedorMensajes.nativeElement.scrollHeight;
    } catch (err) { }
  }
  cargarAmigos() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any[]>(`${environment.apiUrl}/amistades/amigos`, { headers })
      .subscribe(data => {
        this.amigos = data;
      });
  }

  conectarWebSocket() {
    this.cliente = new Client({
      webSocketFactory: () => new SockJS(`${environment.apiUrl.replace('/api', '')}/ws`),
      reconnectDelay: 5000,
      onConnect: () => {
        this.cliente.subscribe(
          `/user/${this.usuarioActual.id}/queue/messages`,
          (msg: IMessage) => {
            const recibido = JSON.parse(msg.body);
            if (this.amigoSeleccionado?.id === recibido.remitenteId) {
              this.mensajes.push(recibido);
            }
          }
        );
      }
    });

    this.cliente.activate();
  }

  seleccionarAmigo(amigo: any) {
    this.amigoSeleccionado = amigo;
    this.mensajes = [];

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any[]>(
      `${environment.apiUrl}/chat/historial?receptorId=${amigo.id}`,
      { headers }
    ).subscribe((mensajes) => {
      this.mensajes = mensajes;
    });
  }

  enviarMensaje() {
    if (!this.mensaje.trim()) return;

    const nuevoMensaje = {
      remitenteId: this.usuarioActual.id,
      receptorId: this.amigoSeleccionado.id,
      contenido: this.mensaje
    };

    this.mensajes.push(nuevoMensaje);

    this.cliente.publish({
      destination: '/app/chat',
      body: JSON.stringify(nuevoMensaje)
    });

    this.mensaje = '';
  }
}
