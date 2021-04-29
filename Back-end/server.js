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

io.on('connection', function(socket) {


    socket.on("message", ({ content, sender, roomId }) => {
        socket.broadcast.to(roomId).emit("received", { content, sender, roomId });
    })


    socket.on("createRoom", function(room) {
        socket.currentRoom = room.roomId;
        socket.join(room.roomId);
    })


    socket.on('leave', () => {
        try {
            socket.leave(socket.currentRoom);
        } catch (e) {
            console.log('[error]', 'leave room :', e);
            socket.emit('error', 'couldnt perform requested action');
        }
    });
});