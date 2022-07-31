const joinRoom = require('./listeners/joinRoom');
const chatMessage = require('./listeners/chatMessage');
const disconnect = require('./listeners/disconnect');

const connection = (io) => {
    io.on('connection', (socket) => {
        joinRoom(socket);
        chatMessage(socket);
        disconnect(socket);
    });
};

module.exports = connection;
