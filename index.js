const express = require('express');
const qrcode = require('qrcode');  // Asegúrate de instalar la librería qrcode
const { Client } = require('whatsapp-web.js');  // Asegúrate de tener instalada whatsapp-web.js
const app = express();
const client = new Client();

// Definir el comando del menú
const menu = `
Bienvenido al Bot de Soporte ATE Guatemala. Elige una opción:

1. Soporte Técnico
2. Solicitar Hosting Luna
3. Horarios de Atención
4. Métodos de Pago
5. Salir
`;

// Enviar el menú al recibir cualquier mensaje que no esté en el menú
client.on('message', (message) => {
  console.log(message.body); // Imprimir el mensaje para depuración

  // Si el mensaje no es uno de los comandos del menú, se muestra el menú
  if (message.body.toLowerCase() !== '1' && message.body.toLowerCase() !== '2' && message.body.toLowerCase() !== '3' && message.body.toLowerCase() !== '4' && message.body.toLowerCase() !== '5') {
    message.reply(`\n${menu}`);
  }

  // Responder a las opciones del menú
  switch (message.body) {
    case '1':
      message.reply('Gracias por contactar con soporte técnico. Un agente estará en breve para ayudarte.');
      // Aquí agregarías la lógica para el ticket de soporte, si es necesario, puedes integrarlo con alguna API de tickets.
      break;
    case '2':
      message.reply('Por favor, envíanos los siguientes datos para solicitar el hosting Luna:\n1. Nombre\n2. Apellido\n3. Correo\n4. Celular\n5. ¿Tienes hosting de terceros?\n6. ¿Tienes dominio? ¿Deseas comprar uno? ¿Deseas activar la potencia lunar?');
      break;
    case '3':
      message.reply('Nuestros horarios de atención son:\nLunes a Viernes: 9 AM - 10 PM\nSábado: 10 AM - 10 PM\nDomingo: 24 horas.');
      break;
    case '4':
      message.reply('Métodos de pago:\n- Banco Azteca\n- Banco Industrial\n- Zigi\n- Cuik\n- PayPal (tarjetas de débito y crédito)');
      break;
    case '5':
      message.reply('Gracias por usar nuestro servicio. ¡Hasta pronto!');
      break;
    default:
      message.reply(`\n${menu}`); // Enviar el menú nuevamente si la opción no está definida.
  }
});

// Ruta principal para verificar si el bot está corriendo
app.get('/', (req, res) => {
  res.send('¡Bot de WhatsApp está funcionando! Visita /qr para ver el código QR.');
});

// Ruta para servir el código QR de WhatsApp
client.on('qr', (qr) => {
  // Genera el QR como imagen en base64
  qrcode.toDataURL(qr, (err, url) => {
    if (err) {
      console.error('Error generando el QR:', err);
      return;
    }

    // Ruta para mostrar el QR
    app.get('/qr', (req, res) => {
      res.send(`
        <h1>Escanea el siguiente código QR con WhatsApp</h1>
        <img src="${url}" alt="QR de WhatsApp" />
      `);
    });
  });
});

// Evento cuando WhatsApp está listo
client.on('ready', () => {
  console.log('Bot de WhatsApp está listo');
});

// Inicializa el cliente de WhatsApp
client.initialize();

// Define el puerto en el que se ejecutará el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
