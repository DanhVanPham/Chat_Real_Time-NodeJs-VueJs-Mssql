const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./Routes/appRoutes.js');
const port = process.env.PORT || 8082;
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const server = app.listen(port, () => {
    console.log(`Listen on port: ${port}`);
})
const socketio = require('socket.io');
const io = socketio(server, { cors: { origin: '*' } });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: 'http://localhost:8080' }));
app.use(cookieParser());

routes(app);

io.on('connection', (socket) => {


    socket.on("message", ({ content, sender, roomId, fullName, avatar }) => {
        socket.broadcast.to(roomId).emit("received", { content, sender, roomId, fullName, avatar });
    })


    socket.on("createRoom", (room) => {
        socket.currentRoom = room.roomId;
        socket.join(room.roomId);
    })


    socket.on('leave', () => {
        try {
            socket.leave(socket.currentRoom);
        } catch (e) {
            socket.emit('error', 'couldnt perform requested action');
        }
    });

    socket.on('typing', ({ sender, roomId }) => {
        try {
            socket.broadcast.to(roomId).emit('typing', `${sender} is typing...`);
        } catch (e) {
            socket.emit('error', 'couldnt perform requested action');
        }
    });

    socket.on('stopTyping', (roomId) => {
        try {
            socket.broadcast.to(roomId).emit('stopTyping');
        } catch (e) {
            socket.emit('error', 'couldnt perform requested action');
        }
    })
});