export interface Review {
  id?: number;
  idUsuario: number;
  nombreUsuario?: string;
  idJuego: number;
  nombreJuego?: string;
  contenido: string;
  fecha?: string;
}
