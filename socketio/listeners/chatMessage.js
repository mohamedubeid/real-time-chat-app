const { getCurrentUser } = require('../../utils/users');
const formatMessage = require('../../utils/messages');
module.exports = (socket, io) => {
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });
};
