var outputText = document.getElementById('loginOutput');

//listen for auth state change
auth.onAuthStateChanged(user => {
	if(user) {
		console.log('user logged in');
	}
	else {
		console.log('user logged out');
	}
})

//signup
const newuser = document.getElementById('newUserForm');
newuser.addEventListener('submit', (e) => {
	e.preventDefault();

	//get user info
	const email = newuser['newEmail'].value;
	const password = newuser['newPassword'].value;

	//signup user
	auth.createUserWithEmailAndPassword(email, password).then( cred => {
		newuser.reset();

		outputText.style.display = 'block';
		outputText.style.color = 'green';
		outputText.innerHTML = "New user has been made and logged in";
	});
});

//logout
const logout = document.getElementById('signoutForm');
logout.addEventListener('click', (e) => {
	e.preventDefault();
	auth.signOut().then(() => {
		outputText.style.display = 'block';
		outputText.style.color = 'orange';
		outputText.innerHTML = "User has been signed out";
	})
})

//signin
const login = document.getElementById('loginForm');
login.addEventListener('submit', (e) => {
	e.preventDefault();

	//get user info
	const email = login['userEmail'].value;
	const password = login['userPassword'].value;

	//signup user
	auth.signInWithEmailAndPassword(email, password).then( cred => {
		login.reset();

		outputText.style.display = 'block';
		outputText.style.color = 'green';
		outputText.innerHTML = "User logged in";
	});
});