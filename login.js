// validate user
// only allow oakland email user
function validate(){
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	// check if the email address is OU address
	var mailformat = /^\w+([\.-]?\w+)*@oakland.edu/;
	if (username.match(mailformat)){
		window.location = "index.html"; // Redirect
		return false;
	}
	else{
		alert("You MUST use OU login account!");
		return false;
	}
}
