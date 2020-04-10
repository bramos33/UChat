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
  socket.emit('new-user', roomName, name)
  socket.emit('user-list', roomName, name)
  
  messageForm.addEventListener('submit', e => {
    e.preventDefault()

    if (messageInput.value != '') {
      const message = messageInput.value
      appendMessage(`You: ${message}`)
      console.log(message)
      socket.emit('send-chat-message', roomName, message)
      messageInput.value = ''
    }
  })
}

socket.on('room-created', room => {
  const roomLink = document.createElement('a')
  roomLink = room
  roomContainer.append(roomLink)
})

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', name =>  {
  appendMessage(`${name} connected`)
})

socket.on('list-users', data => {
  roomUserContainer.innerHTML = ''
  Object.keys(data).forEach(item =>
    appendUser(data[item])
    )
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