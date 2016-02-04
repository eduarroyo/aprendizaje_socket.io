// Importar módulos requeridos
var express = require('express');
var http = require('http');

var
    // server es el objeto servidor
    server,
    // app es la instancia de la aplicación web express.
    app;

// Inicializar la app express y configurar la acción para la ruta raíz.
app = express();
app.get('/', function (req, res) {
    'use strict';
    res.sendFile(__dirname + '/views/index.html');
});

// Inicializar el servidor y ponerlo a escuchar el puerto 3000.
server = http.Server(app);
server.listen(3000, function () {
    'use strict';
    console.log('listening on *:3000');
});