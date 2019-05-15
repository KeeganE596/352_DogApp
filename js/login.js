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
  document.getElementById('loginForm').addEventListener('submit', submitForm);
}

// Catch form submit
function submitForm(e) {
  e.preventDefault();
  //console.log('caught submit');

  // Get values
  var username = getInputVal('username');
  var userExists = false;
  console.log(username);
  databaseUsersRef.child('james');

  databaseUsersRef.child(username).once('value', snapshot => {
    if(snapshot.exists()){
    	userExists = true;
      console.log("exists");
      userDoesExists();
    } 
    else{
      userExists = false;
      console.log("doesnt exist");
      userDoesNotExist();
    }
  });
}

// Function to get form values
function getInputVal(id) {
  return document.getElementById(id).value;
}

function userDoesExists() {
  console.log('youre logged in');

  var outputText = document.getElementById('loginOutput');
  outputText.style.display = 'block';
  outputText.style.color = 'green';
  outputText.innerHTML = "Logged In";

  window.location.href = "map.html";
}

function userDoesNotExist() {
  console.log('user doesnt exist');

  var outputText = document.getElementById('loginOutput');
  outputText.style.display = 'block';
  outputText.style.color = 'red';
  outputText.innerHTML = "User Does Not Exist";
}