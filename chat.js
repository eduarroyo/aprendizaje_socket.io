var _usuariosConectados = {};
var _nombreUsuarioPorDefecto = "Anonimo";
var _sio;

// Actualiza la lista de usuarios conectados y devuelve el objeto usuario correspondiente
// al clientID.
function nuevoUsuario(clientID) {
    'use strict';
    _usuariosConectados[clientID] = {
        nombre: _nombreUsuarioPorDefecto,
        ultimaConexion: new Date()
    };
    return _usuariosConectados[clientID];
}

function conexionUsuario(clientID) {
    'use strict';
    var usuario = _usuariosConectados[clientID];
    usuario.ultimaConexion = new Date();
    return usuario;
}

function eventosEntrada(clientID, usuario) {
    'use strict';
    return [
        {
            name: "disconnect",
            handler: function () {
                console.log("Cliente desconectado:", clientID);
                delete _usuariosConectados[clientID];
                _sio.emit('online users', _usuariosConectados);
            }
        },
        {
            name: 'chat message',
            handler: function (data) {
                conexionUsuario(clientID);
                console.log('Nuevo mensaje: ' + data);
                _sio.emit('chat message', usuario.nombre + " dice: " + data);
                _sio.emit('online users', _usuariosConectados);
            }
        },
        {
            name: "new username",
            handler: function (data) {
                console.log("Nuevo nombre de usuario:", data);
                conexionUsuario(clientID);
                usuario.nombre = data;
                _sio.emit('online users', _usuariosConectados);
            }
        }
    ];
}

function init(sio) {
    'use strict';
    _sio = sio;
    _sio.on("connection", function (socket) {
        var clientID, usuario, eventos;

        // Identificador del cliente
        clientID = socket.client.conn.id;

        // Obtiene el usuario si estaba conectado o si no lo crea.
        usuario = nuevoUsuario(clientID);
        console.log("Cliente conectado:", clientID);
        // Registrar los eventos del servidor socketio
        eventos = eventosEntrada(clientID, usuario);
        eventos.forEach(function (ev) {
            socket.on(ev.name, ev.handler);
        });
        _sio.emit('online users', _usuariosConectados);
    });
}

module.exports = init;