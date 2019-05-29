var outputText = document.getElementById('loginOutput');

//listen for auth state change
auth.onAuthStateChanged(user => {
	if(user) {
		loggedIn.style.display = "block"
		login.style.display = "none"
		newuser.style.display = "none";
		signupParent.style.display = "none"
		loginParent.style.display = "none"
		logout.style.display = "block";
		markersContainer.style.display = "block";
	}
	else {
		loggedIn.style.display = "none"
		login.style.display = "none"
		newuser.style.display = "none";
		signupParent.style.display = "block"
		loginParent.style.display = "block"
		logout.style.display = "none";
		markersContainer.style.display = "none";
	}
})

const newuser = document.getElementById('newUserForm');
const login = document.getElementById('loginForm');
const loggedIn = document.getElementById('loggedIn');
const markersContainer = document.getElementById('addMarkersContainer');

//signup
const signupParent = document.getElementById('signupParent');
signupParent.addEventListener('click', function() {
	if(newuser.style.display == "block") {
		newuser.style.display = "none";
	}
	else {
		newuser.style.display = "block";
		login.style.display = "none";
	}
	

	newuser.addEventListener('submit', (e) => {
		e.preventDefault();

		//get user info
		const email = newuser['newEmail'].value;
		const password = newuser['newPassword'].value;

		//signup user
		auth.createUserWithEmailAndPassword(email, password).then( cred => {
			newuser.reset();
		});
	});
});



//login
const loginParent = document.getElementById('loginParent');
loginParent.addEventListener('click', function() {
	if(login.style.display == "block") {
		login.style.display = "none";
	}
	else {
		login.style.display = "block";
		newuser.style.display = "none";
	}

	login.addEventListener('submit', (e) => {
		e.preventDefault();

		//get user info
		const email = login['userEmail'].value;
		const password = login['userPassword'].value;

		//signup user
		auth.signInWithEmailAndPassword(email, password).then( cred => {
			login.reset();
		});
	});
});

//logout
const logout = document.getElementById('signoutForm');
logout.addEventListener('click', (e) => {
	e.preventDefault();
	auth.signOut();
})
