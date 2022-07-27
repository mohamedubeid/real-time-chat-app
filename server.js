const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getroomUsers,
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const boatName = 'chatCord';

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    socket.on('joinRoom', ({ username, room }) => {
        console.log('New WS connection...', username, room);
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        socket.emit(
            'message',
            formatMessage(boatName, `welcome to chatCord ${username}`)
        );

        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                formatMessage(boatName, `${username} has joined the chat.`)
            );

        io.to(user.room).emit('usersRoom', {
            room: user.room,
            users: getroomUsers(user.room),
        });
    });

    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit(
                'message',
                formatMessage(boatName, `${user.username} has left the chat`)
            );
        }

        io.to(user.room).emit('usersRoom', {
            room: user.room,
            users: getroomUsers(user.room),
        });
    });
});

const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
