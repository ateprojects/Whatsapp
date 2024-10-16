const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const express = require('express');

// Inicializa el cliente de WhatsApp
const client = new Client({
  authStrategy: new LocalAuth(),  // Autenticación local
});

// Crear un servidor Express
const app = express();
const port = process.env.PORT || 3000;

// Al generar el QR, lo convertimos en una imagen y lo servimos
client.on('qr', (qr) => {
  console.log('Generando el QR...');
  
  // Convertimos el QR a una imagen base64
  qrcode.toDataURL(qr, (err, url) => {
    if (err) {
      console.error('Error generando el QR:', err);
    } else {
      console.log('QR generado exitosamente.');
      // Hacemos que el servidor sirva esta imagen cuando alguien acceda a "/qr"
      app.get('/qr', (req, res) => {
        res.send(`<img src="${url}" alt="QR para WhatsApp" />`);
      });
    }
  });
});

// Cuando el cliente esté listo
client.on('ready', () => {
  console.log('Bot de WhatsApp está listo!');
});

// Responde a los mensajes
client.on('message', (message) => {
  console.log(message.body); // Muestra el mensaje en consola

  // Responde con un mensaje predeterminado
  if (message.body === 'hola') {
    message.reply('¡Hola! Soy el bot de ATE Guatemala. ¿En qué te puedo ayudar?');
  }
  // Añadir más respuestas o lógica según sea necesario
});

// Inicia el cliente
client.initialize();

// Servir el bot en Express
app.get('/', (req, res) => {
  res.send('¡Bot de WhatsApp está funcionando! Visita /qr para ver el código QR.');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
