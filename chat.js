var _usuariosConectados = {
//  socketID: {
//      clientID: socketID
//      nombre: '',
//      ultimaConexion: new Date(),
//      socket: socket
//  }

};
var _nombreUsuarioPorDefecto = "Anonimo";
var _sio;

// Actualiza la lista de usuarios conectados y devuelve el objeto usuario correspondiente
// al clientID.
function nuevoUsuario(socket) {
    'use strict';
    var socketID = socket.client.conn.id;
    _usuariosConectados[socketID] = {
        nombre: _nombreUsuarioPorDefecto,
        ultimaConexion: new Date(),
        socket: socket,
        clientID: socketID
    };
    return _usuariosConectados[socketID];
}

// Proporciona la lista de los usuarios conectados
function usuarios() {
    'use strict';
    var uu = [], usuario;
    Object.keys(_usuariosConectados).forEach(function (id) {
        usuario = _usuariosConectados[id];
        uu.push({
            nombre: usuario.nombre,
            ultimaConexion: usuario.ultimaConexion
        });
    });
    return uu;
}

// Lista de los eventos que maneja el servicio.
function eventosEntrada(usuario) {
    'use strict';
    return [
        {
            name: "disconnect",
            handler: function () {
                console.log("Cliente desconectado:", usuario.clientID);
                delete _usuariosConectados[usuario.clientID];
                _sio.emit('online users', usuarios());
            }
        },
        {
            name: 'chat message',
            handler: function (data) {
                usuario.ultimaConexion = new Date();
                console.log('Nuevo mensaje: ' + data);

                // socket.broadcast.emit envía el evento a todos los clientes menos al del socket.
                // _sio.emit envía el evento a todos.
                usuario.socket.broadcast.emit('chat message', usuario.nombre + " dice: " + data);
                _sio.emit('online users', usuarios());
            }
        },
        {
            name: "new username",
            handler: function (data) {
                console.log("Nuevo nombre de usuario:", data);
                usuario.ultimaConexion = new Date();
                usuario.nombre = data;
                _sio.emit('online users', usuarios());
            }
        }
    ];
}

function init(sio) {
    'use strict';
    _sio = sio;
    _sio.on("connection", function (socket) {
        var usuario, eventos;

        // Obtiene el usuario si estaba conectado o si no lo crea.
        usuario = nuevoUsuario(socket);
        console.log("Cliente conectado:", usuario.clientID);

        // Registrar los eventos del servidor socketio
        eventos = eventosEntrada(usuario);
        eventos.forEach(function (ev) {
            socket.on(ev.name, ev.handler);
        });

        // Enviar lista de usuarios conectados a todos los clientes.
        _sio.emit('online users', usuarios());
    });
}

module.exports = init;