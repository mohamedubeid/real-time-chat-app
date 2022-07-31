const joinRoom = require('./listeners/joinRoom');
const chatMessage = require('./listeners/chatMessage');
const disconnect = require('./listeners/disconnect');

const connection = (io) => {
    io.on('connection', (socket) => {
        joinRoom(socket, io);
        chatMessage(socket, io);
        disconnect(socket, io);
    });
};

module.exports = connection;
