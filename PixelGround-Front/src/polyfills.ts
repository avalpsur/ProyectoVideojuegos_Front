/***************************************************************************************************
 * ZONA DE INICIO: NECESARIA PARA ANGULAR
 **************************************************************************************************/
import 'zone.js'; // ¡Obligatorio para que Angular funcione correctamente!


/***************************************************************************************************
 * POLYFILLS PERSONALIZADOS PARA LIBRERÍAS QUE ESPERAN UN ENTORNO NODE.JS
 **************************************************************************************************/

// Evita errores de "global is not defined" al usar stompjs, sockjs-client, etc.
(window as any).global = window;

// Algunas librerías esperan una variable process.env
(window as any).process = {
  env: {
    DEBUG: undefined
  }
};

// (Opcional) Si usas alguna librería que requiere crypto (como uuid), puedes añadir esto:
// (window as any).crypto = window.crypto || {};
