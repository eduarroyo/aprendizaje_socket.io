// Importar módulos requeridos
var http = require('http');
var express = require('express');
var socket_io = require('socket.io');
var chat = require('./chat');

var
    // server es el objeto servidor http de node.js
    server,
    // app es la instancia de la aplicación web express.
    app,
    // io es la instancia de la aplicación socket.io
    io,
    chatapp;

// Inicializar la app express y configurar la acción para la ruta raíz.
app = express();
app.get('/', function (req, res) {
    'use strict';
    res.sendFile(__dirname + '/views/index.html');
});

// Inicializar el servidor, necesario para el servicio socket.io
server = http.Server(app);
io = socket_io(server);
chatapp = chat(io);

// Poner el servidor a escuchar el puerto 3000.
server.listen(3000, function () {
    'use strict';
    console.log('listening on *:3000');
});