var databaseRef;

function initializeFirebase() {
  var config = {
    apiKey: "AIzaSyDzTMFaxp5P0J4BHwRCNhuGtI-DoZXVbKk",
    authDomain: "dogapp-f8549.firebaseapp.com",
    databaseURL: "https://dogapp-f8549.firebaseio.com",
    projectId: "dogapp-f8549",
    storageBucket: "dogapp-f8549.appspot.com",
    messagingSenderId: "250707991740",
    appId: "1:250707991740:web:586111734a49a755"
  };
  firebase.initializeApp(config);
  databaseUsersRef = firebase.database().ref('users');
  console.log('intialized');
  document.getElementById('newUserForm').addEventListener('submit', submitForm);
}

// Catch form submit
function submitForm(e) {
  e.preventDefault();
  //console.log('caught submit');

  // Get values
  var username = getInputVal('username');

  console.log(username);

  databaseUsersRef.child(username).once('value', snapshot => {
    if(snapshot.exists()){
      console.log("exists");
      userAlreadyExists();
    } 
    else{
      console.log("doesnt exist");
      addNewUser(username);
    }
  });
}

// Function to get form values
function getInputVal(id) {
  return document.getElementById(id).value;
}

function addNewUser(username) {
  databaseUsersRef.child(username);

  var newDatabaseUserRef = databaseUsersRef.child(username);
  newDatabaseUserRef.set({
    username: username
  });

  var outputText = document.getElementById('loginOutput');
  outputText.style.display = 'block';
  outputText.style.color = 'green';
  outputText.innerHTML = "New User Added";

  console.log('adding ' + username);
}

function userAlreadyExists() {
  console.log('user already exists');

  var outputText = document.getElementById('loginOutput');
  outputText.style.display = 'block';
  outputText.style.color = 'orange';
  outputText.innerHTML = "User Already Exists";
}