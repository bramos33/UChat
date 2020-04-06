// validate user
// only allow oakland email user
const socket = io('http://localhost:3000')

function validate(){
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	// check if the email address is OU address
	var mailformat = /^\w+([\.-]?\w+)*@oakland.edu/;
	if (!username.match(mailformat)){
		alert("You MUST use OU login account!");
		
	}
}
