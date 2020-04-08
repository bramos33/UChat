const socket = io('http://localhost:3000')
const messageContainer = document.getElementById('message-container')
const roomContainer = document.getElementById('room-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const roomUserContainer = document.getElementById('room-users-container')
const roomTitle = document.getElementById('room-name')
const online = document.getElementById('online')

if (messageForm != null) {
  roomTitle.append(roomName)
  const name = prompt('What is your name?')
  appendMessage('You joined')
  appendUser(name)
  socket.emit('new-user', roomName, name)

  messageForm.addEventListener('submit', e => {
    e.preventDefault()

    if (messageInput.value != '') {
      const message = messageInput.value
      appendMessage(`You: ${message}`)
      socket.emit('send-chat-message', roomName, message)
      messageInput.value = ''
    }
  })
}

socket.on('room-created', room => {
  const roomElement = document.createElement('div')
  roomElement.innerText = room
  const roomLink = document.createElement('a')
  roomLink.href = `/${room}`
  roomLink.innerText = 'join'
  roomContainer.append(roomElement)
  roomContainer.append(roomLink)
})

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
  appendUser(name)
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}

function appendUser(name) {
  const userElement = document.createElement('div')
  userElement.innerText = name
  roomUserContainer.append(userElement)
}