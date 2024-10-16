const express = require('express');
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode');

const app = express();
const port = 3000;

// Crear cliente de WhatsApp Web
const client = new Client();

// Inicialización de WhatsApp Web
client.on('qr', (qr) => {
    // Generar el QR para ser escaneado
    qrcode.toDataURL(qr, (err, url) => {
        if (err) {
            console.error('Error generando el QR:', err);
            return;
        }
        // Enviar el QR generado al navegador para que el usuario lo escanee
        app.get('/qr', (req, res) => {
            res.send(`
                <h1>Escanea el siguiente código QR con WhatsApp</h1>
                <img src="${url}" alt="QR de WhatsApp" />
                <p>El QR es válido solo por un tiempo limitado. Si no funciona, vuelve a cargar esta página.</p>
            `);
        });
    });
});

// Este evento se activa cuando WhatsApp Web se ha autenticado correctamente
client.on('ready', () => {
    console.log('WhatsApp está listo para enviar y recibir mensajes');
});

// Este evento se activa si hay un fallo en la autenticación
client.on('auth_failure', (message) => {
    console.error('Autenticación fallida:', message);
    app.get('/qr', (req, res) => {
        res.send(`
            <h1>Hubo un error al intentar autenticar el WhatsApp Web</h1>
            <p>Por favor, intenta de nuevo.</p>
        `);
    });
});

// Lógica para responder a los mensajes
client.on('message', (message) => {
    console.log('Mensaje recibido:', message.body);

    // Si el mensaje es "hola" o cualquier otro, mostramos el menú
    if (message.body.toLowerCase() === 'hola') {
        client.sendMessage(message.from, '¡Hola! ¿Cómo puedo ayudarte? Elige una opción:\n1. Soporte\n2. Solicitar Hosting Luna\n3. Ver horarios\n4. Métodos de pago');
    }

    // Responde al comando "Soporte"
    if (message.body === '1') {
        client.sendMessage(message.from, 'Has elegido soporte. Un agente se pondrá en contacto contigo pronto.');
    }

    // Responde al comando "Solicitar Hosting Luna"
    if (message.body === '2') {
        client.sendMessage(message.from, 'Para solicitar el hosting Luna, por favor envíanos los siguientes datos:\n1. Nombre\n2. Apellido\n3. Correo electrónico\n4. Número de celular\n5. ¿Tienes hosting de terceros?\n6. ¿Tienes un dominio?\n7. ¿Quieres activar la potencia lunar?');
    }

    // Responde al comando "Ver horarios"
    if (message.body === '3') {
        client.sendMessage(message.from, 'Nuestros horarios son:\n- Lunes a Viernes: 9:00 AM - 10:00 PM\n- Sábado: 10:00 AM - 10:00 PM\n- Domingo: 24 horas');
    }

    // Responde al comando "Métodos de pago"
    if (message.body === '4') {
        client.sendMessage(message.from, 'Los métodos de pago disponibles son:\n- Banco Azteca\n- Banco Industrial\n- Zigi\n- Cuik\n- Tarjetas de débito y crédito mediante PayPal');
    }

    // Si el mensaje no corresponde a un comando, responder con un mensaje genérico
    if (message.body !== '1' && message.body !== '2' && message.body !== '3' && message.body !== '4' && message.body.toLowerCase() !== 'hola') {
        client.sendMessage(message.from, 'Lo siento, no reconozco ese comando. Por favor, elige una opción del menú.');
    }
});

// Mantener la sesión activa para evitar desconexión
client.on('disconnected', (reason) => {
    console.log('Cliente desconectado:', reason);
    client.initialize();  // Re-conecta el cliente
});

// Ruta de prueba para enviar un mensaje (ejemplo)
app.get('/send-message', (req, res) => {
    const to = 'NUMERO_DE_DESTINO';  // Aquí pon el número de teléfono destino
    const message = '¡Hola, este es un mensaje enviado desde la API de WhatsApp!';
    
    client.sendMessage(to, message)
        .then(response => {
            res.send('Mensaje enviado correctamente');
        })
        .catch(error => {
            res.send('Error al enviar el mensaje: ' + error.message);
        });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en puerto ${port}`);
    client.initialize();  // Inicializa el cliente de WhatsApp Web
});
