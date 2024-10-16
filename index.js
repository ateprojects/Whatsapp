/**
 * Bot para whatsapp
 * web: https://kuatroestrellas.github.io/blog/
 * responde al hola mundo con un mensaje
 * requiere nodejs v12 o superior y las librerias qrcode-terminal y whatsapp-web.js
 * npm i qrcode-terminal whatsapp-web.js
**/

const qrcode = require('qrcode-terminal');

//Crea una sesión con whatsapp-web y la guarda localmente para autenticarse solo una vez por QR
const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client({
    authStrategy: new LocalAuth()
});

//Genera el código qr para conectarse a whatsapp-web
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

//Si la conexión es exitosa muestra el mensaje de conexión exitosa
client.on('ready', () => {
    console.log('Conexion exitosa nenes');
});


//Aquí sucede la magia, escucha los mensajes y aquí es donde se manipula lo que queremos que haga el bot
const lastInteraction = new Map(); // Para manejar las interacciones y el tiempo de espera para el menú

client.on('message', message => {
    const user = message.from;
    const now = Date.now();

    // Verificar si el último mensaje del usuario fue hace más de 10 minutos
    if (!lastInteraction.has(user) || (now - lastInteraction.get(user) > 10 * 60 * 1000)) {
        // Menú principal para cualquier mensaje recibido que no sea soporte ni hosting
        client.sendMessage(user, `👋 ¡Hola! Bienvenido a ATE Guatemala. Estos son nuestros servicios disponibles:
        
1️⃣ Soporte al Cliente
2️⃣ Solicitar Hosting Luna
3️⃣ 🕐 Nuestros Horarios
4️⃣ 💳 Métodos de Pago

Por favor, responde con el número de la opción que te gustaría conocer.`);
    }

    // Opción 1: Soporte al Cliente (crea un ticket de soporte y detiene el menú por 10 minutos)
    if (message.body === '1') {
        client.sendMessage(user, `🎫 Hemos creado un ticket de soporte para ti. Un agente te estará respondiendo pronto por este medio. Gracias por tu paciencia. 🕒`);

        // Actualiza la última interacción para detener el envío del menú por 10 minutos
        lastInteraction.set(user, now);
    }

    // Opción 2: Solicitar Hosting Luna (recolección de datos)
    else if (message.body === '2') {
        client.sendMessage(user, `🌕 ¡Gracias por tu interés en nuestro Hosting Luna! Por favor, envíanos los siguientes datos para proceder:

1️⃣ Nombre
2️⃣ Apellido
3️⃣ Correo electrónico
4️⃣ Número de celular
5️⃣ ¿Tienes hosting de terceros? (Sí/No)
6️⃣ ¿Tienes dominio propio? (Sí/No)
7️⃣ ¿Deseas comprar un dominio con nosotros? (Sí/No)
8️⃣ ¿Deseas activar la "Potencia Lunar"? (Optimización especial para alto rendimiento) (Sí/No)`);

        // Aquí podrías agregar más lógica para manejar la recolección de datos del usuario
    }

    // Opción 3: Nuestros Horarios (se ajustan según el día)
    else if (message.body === '3') {
        const currentDay = new Date().getDay();
        let horarioMsg;

        // Definir horarios según el día de la semana
        if (currentDay >= 1 && currentDay <= 5) { // De lunes a viernes
            horarioMsg = `🕒 Nuestros horarios de atención de lunes a viernes son de 9:00 AM a 10:00 PM. Fuera de este horario, puedes dejarnos un mensaje y te responderemos lo antes posible.`;
        } else if (currentDay === 6) { // Sábado
            horarioMsg = `🕒 Nuestro horario de atención los sábados es de 10:00 AM a 10:00 PM. Fuera de este horario, puedes dejarnos un mensaje y te responderemos lo antes posible.`;
        } else { // Domingo
            horarioMsg = `🕒 Hoy es domingo, y ofrecemos atención 24 horas. ¡Escríbenos en cualquier momento!`;
        }

        client.sendMessage(user, horarioMsg);
    }

    // Opción 4: Métodos de Pago (incluir opciones)
    else if (message.body === '4') {
        client.sendMessage(user, `💳 Aceptamos los siguientes métodos de pago:

1️⃣ Banco Azteca
2️⃣ Banco Industrial
3️⃣ Zigi
4️⃣ Cuik
5️⃣ Tarjetas de débito y crédito mediante PayPal

Para más detalles, contáctanos directamente o revisa las opciones en nuestro sitio web. 🌐`);
    }

    // Respuesta por defecto para mensajes no válidos
    else if (['1', '2', '3', '4'].indexOf(message.body) === -1) {
        client.sendMessage(user, '❌ Lo siento, no entiendo ese mensaje. Por favor, responde con el número de la opción que te gustaría conocer del menú.');
    }
});
client.initialize();
