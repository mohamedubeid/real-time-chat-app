const { userJoin } = require('../../utils/users');
const formatMessage = require('../../utils/messages');

module.exports = (socket) => {
    socket.on('joinRoom', ({ username, room }) => {
        console.log('New WS connection...', username, room);
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        socket.emit(
            'message',
            formatMessage(
                process.env.BOAT_NAME,
                `Welcome to Chat Cord ${username}`
            )
        );

        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                formatMessage(
                    process.env.BOAT_NAME,
                    `${username} has joined the chat.`
                )
            );

        io.to(user.room).emit('usersRoom', {
            room: user.room,
            users: getRoomUsers(room),
        });
    });
};
