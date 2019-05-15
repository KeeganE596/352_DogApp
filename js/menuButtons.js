function initializeButtons() {
	document.getElementById('loginForm').addEventListener('submit', goLogin);
	document.getElementById('newUserForm').addEventListener('submit', goNewUser);
}

function goLogin(e) {
	e.preventDefault();
	window.location.href = "login.html";
}

function goNewUser(e) {
	e.preventDefault();
	window.location.href = "newUser.html";
}