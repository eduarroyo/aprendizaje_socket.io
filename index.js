// Importar módulos requeridos
var express = require('express');
var http = require('http');
var socket_io = require('socket.io');

var
    // server es el objeto servidor
    server,
    // app es la instancia de la aplicación web express.
    app,
    // io es la instancia de la aplicación socket.io
    io;

// Inicializar la app express y configurar la acción para la ruta raíz.
app = express();
app.get('/', function (req, res) {
    'use strict';
    res.sendFile(__dirname + '/views/index.html');
});

// Inicializar el servidor y ponerlo a escuchar el puerto 3000.
server = http.Server(app);
io = socket_io(server);

io.on('connection', function (socket) {
    'use strict';
    socket.on('chat message', function (msg) {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
});

server.listen(3000, function () {
    'use strict';
    console.log('listening on *:3000');
});