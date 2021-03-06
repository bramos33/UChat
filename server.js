const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
io.bind

const rooms = {}
var validated = false

app.get('/', (req, res) => {
  if (validated) {
    res.render('index', { rooms: rooms })
  } else {
    res.redirect('/login')
  }
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/', (req, res) => {
  loggedIn = true
  res.redirect('/')

})

app.post('/goback', (req, res) => {
  loggedIn = true
  res.redirect('/')

})

app.post('/logout', (req, res) => {
  loggedIn = false
  validated = false
  res.redirect('/login')

})

app.post('/room', (req, res) => {
  if (rooms[req.body.room] != null) {
    return res.redirect('/')
  }
  rooms[req.body.room] = { users: {} }
  res.redirect('/')
  // Send message that new room was created
  io.emit('room-created', req.body.room)
})

app.get('/:room', (req, res) => {
  if (rooms[req.params.room] == null) {
    return res.redirect('/')
  }
  res.render('room', { roomName: req.params.room })
})

server.listen(3000)

io.on('connection', socket => {
  console.log('user connected')
  socket.on('validate', data => {
    validated = data
  })

  socket.on('new-user', (room, name) => {
    socket.join(room)
    rooms[room].users[socket.id] = name
    socket.to(room).broadcast.emit('user-connected', name)
  })

  socket.on('user-list', (room, name) => {
    rooms[room].users[socket.id] = name
    io.in(room).emit('list-users', rooms[room].users)
  })

  socket.on('send-chat-message', (room, message) => {
    socket.to(room).broadcast.emit('chat-message', { message: message, name: rooms[room].users[socket.id] })
  })
  
  socket.on('disconnect', () => {
    getUserRooms(socket).forEach(room => {
      socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id])
      delete rooms[room].users[socket.id]
      io.in(room).emit('list-users', rooms[room].users)
    })
    
  })
})

function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) names.push(name)
    return names
  }, [])
}