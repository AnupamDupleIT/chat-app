const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const { Howl } = require('howler');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('audio');
});

let users = {};

io.on('connection', (socket) => {
  socket.on('new-user', (username) => {
    users[socket.id] = username;
    socket.broadcast.emit('user-connected', username);
  });

  socket.on('send-chat-message', (message) => {
    socket.broadcast.emit('chat-message', { message, username: users[socket.id] });
  });

  socket.on('play-audio', express.static(__dirname + '/node_modules/howler/dist'), (audioFile) => {
    const sound = new Howl({
      src: [`/audio/${audioFile}`],
    });
    sound.play();
    socket.broadcast.emit('audio-played', { audioFile, username: users[socket.id] });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id]);
    delete users[socket.id];
  });
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
