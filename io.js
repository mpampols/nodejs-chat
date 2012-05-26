module.exports = function(io) {

    io.sockets.on('connection', function(socket) {
                    
        socket.on('set_nickname', function(nickname, callback) {
            var isAvailable = isNicknameAvailable(nickname);

            if (isAvailable) {
                socket.nickname = nickname;
            }

            callback(isAvailable);
            
            io.sockets.emit('user_connected', socket.id, socket.nickname);
            
            var clients = io.sockets.clients();
            io.sockets.emit('user_new');

            for (var client in clients) {
                if (client.nickname != nickname) {
                    client = clients[client];
                    io.sockets.emit('user_connected', client.id, client.nickname);
                }
            }
            
            sendMessage("SERVER", "User <b>" + nickname + "</b> connected.");
        });

        socket.on('message', function(message) {
            sendMessage(socket.nickname, message);
        });

        socket.on('disconnect', function(message) {
            io.sockets.emit('user_disconnected', socket.id);
            sendMessage("SERVER", "User <b>" + socket.nickname + "</b> disconnected.");
        });

    });

    var sendMessage = function(nickname, message) {
        io.sockets.emit('message', nickname, message);
    };

    var isNicknameAvailable = function(nickname) {
        var clients = io.sockets.clients();

        for (var client in clients) {
            if (clients.hasOwnProperty(client)) {
                client = clients[client];
                if (client.nickname == nickname) {
                    return false;
                }
            }
        }
        return true;
    };

}