const { userLeave, getRoomUsers } = require('../../utils/users');
const formatMessage = require('../../utils/messages');
module.exports = (socket) => {
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit(
                'message',
                formatMessage(
                    process.env.BOAT_NAME,
                    `${user.username} has left the chat`
                )
            );
        }

        io.to(user.room).emit('usersRoom', {
            room: user.room,
            users: getRoomUsers(user.room),
        });
    });
};
