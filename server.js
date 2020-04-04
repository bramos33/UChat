var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/login.html');
});

app.get('/index.html', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/script.js', function(req, res) {
    res.sendFile(__dirname + '/script.js');
});

app.get('/login.js', function(req, res) {
    res.sendFile(__dirname + '/login.js');
});

http.listen(3000, function(){
  console.log('Chat Server listening at *:3000');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

const users = {}

io.on('connection', socket => {
    socket.on('new-user', name => {
        users[socket.id] = name
        socket.broadcast.emit('user-connected', name)
    })
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
    })
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })
})