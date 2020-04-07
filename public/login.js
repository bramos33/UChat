// validate user
// only allow oakland email user
const socket = io('http://localhost:3000')
const logInButton = document.getElementById("login-form")
var username = document.getElementById("username")
var password = document.getElementById("password")

function validate(email, pass) {

	// check if the email address is OU address
	var mailformat = /^\w+([\.-]?\w+)*@oakland.edu/
	if (!email.match(mailformat)) {
		return false
	} else {
		return true
	}
}

logInButton.addEventListener('submit', e => {
	if (validate(username.value, password.value)) {
		socket.emit('validate', true)
	} else { alert("Your input is invalid. Try again."); }
})