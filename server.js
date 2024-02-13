const express = require('express');
const socket = require('socket.io');

const app = express();
const server = app.listen(3000)

app.use(express.static('public'));

const io = socket(server);

io.on('connection', (socket) => {
    console.log(socket.id);
    socket.join('general')

    socket.on('join_room', (data) => {
        socket.leave('general');
        socket.join(data.room);
        io.sockets.in(data.room).emit('join_room', data);
    });

    socket.on('leave_room', (data) => {
        socket.leave(data.room);
        socket.broadcast.to(data.room).emit('leave_room', data);
        socket.join('general')
    });

    socket.on('chat', (data) => {
        io.sockets.in(data.room).emit('chat', data);    
    });

    socket.on('typing', (data) => {
        socket.broadcast.to(data.room).emit('typing', data.sender);
    });

    socket.on('cancel_typing', (room) => {
        socket.broadcast.to(room).emit('cancel_typing');
    });
});
