const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

// Inicializa el cliente de WhatsApp
const client = new Client({
  authStrategy: new LocalAuth(),  // Autenticación local
});

// Muestra el QR en la consola para la autenticación de WhatsApp
client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
  console.log('Escanea este código QR con tu WhatsApp!');
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

// Crear servidor con Express (si lo deseas para APIs adicionales)
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('¡Bot de WhatsApp está funcionando!');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
