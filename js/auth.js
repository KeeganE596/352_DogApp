var outputText = document.getElementById('loginOutput');

//listen for auth state change
auth.onAuthStateChanged(user => {
	if(user) {
		loggedIn.style.display = "block";
		login.style.display = "none";
		newuser.style.display = "none";
		signupParent.style.display = "none";
		loginParent.style.display = "none";
		logout.style.display = "block";
		loginStatCont.style.display = "flex";
		loginCont.style.display = "none";

		if(window.innerWidth < 1100) {
			markersContainerMobile.style.display = "flex";
			markersContainerDesktop.style.display = "none";
		}
		else {
			markersContainerDesktop.style.display = "flex";
			markersContainerMobile.style.display = "none";
		}
		
		fs.collection('users').doc(user.uid).get().then(doc => {
			document.getElementById('loggedIn').innerHTML = doc.data().username;
		});
	}
	else {
		loggedIn.style.display = "none";
		login.style.display = "none";
		newuser.style.display = "none";
		signupParent.style.display = "block";
		loginParent.style.display = "block";
		logout.style.display = "none";
		markersContainerDesktop.style.display = "none";
		markersContainerMobile.style.display = "none";
		loginStatCont.style.display = "none";

	}
});

const newuser = document.getElementById('newUserForm');
const login = document.getElementById('loginForm');
const loggedIn = document.getElementById('loggedIn');
const markersContainerDesktop = document.getElementById('addMarkersContainerDesktop');
const markersContainerMobile = document.getElementById('addMarkersContainerMobile');
const lButton = document.getElementById('loginParent');
const suButton = document.getElementById('signupParent');
const loginStatCont = document.getElementById('loginStatCont');
const loginCont = document.getElementById('loginCont');

//signup
const signupParent = document.getElementById('signupParent');
signupParent.addEventListener('click', function() {
	if(newuser.style.display == "block") {
		newuser.style.display = "none";
		lButton.style.display = "block";
	}
	else {
		newuser.style.display = "block";
		login.style.display = "none";
		lButton.style.display = "none";
	}
	

	newuser.addEventListener('submit', (e) => {
		e.preventDefault();

		//get user info
		const email = newuser['newEmail'].value;
		const password = newuser['newPassword'].value;

		//signup user
		auth.createUserWithEmailAndPassword(email, password).then( cred => {
			return fs.collection('users').doc(cred.user.uid).set({
				username: newuser['newUsername'].value
			});
		}).then(() => {
			newuser.reset();
		});
	});
});



//login
const loginParent = document.getElementById('loginParent');
loginParent.addEventListener('click', function() {
	if(login.style.display == "block") {
		login.style.display = "none";
		suButton.style.display = "block";
	}
	else {
		login.style.display = "block";
		newuser.style.display = "none";
		suButton.style.display = "none";
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
