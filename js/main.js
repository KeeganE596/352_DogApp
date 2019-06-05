function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(initializeMap);
  }
}

var map;
var selected = null;
var pathlocations = [];
const saveButton = document.getElementById('saveRouteForm');
var userID = null;
var userWalks = [];

function initializeMap(position) {
  // Get current position
  var latVar = position.coords.latitude;
  var lonVar = position.coords.longitude;
  var myLatLng = {lat: latVar, lng: lonVar};

  // Initialize map options
  var mapOptions = {
    center: myLatLng,
    zoom: 14,
    disableDefaultUI: true,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [ {"visibility": "off"} ]
      }, {
        featureType: "poi.park",
        elementType: "labels",
        stylers: [ {"visibility": "on"} ]
      }, {
        featureType: "road.highway",
        elementType: "labels.icon",
        stylers: [ {"visibility": "off"} ],
      }, {
        featureType: "transit.station.bus",
        elementType: "labels",
        stylers: [ {"visibility": "off"} ]
      }, {
        featureType: "transit.station.rail",
        elementType: "labels",
        stylers: [ {"visibility": "off"} ]
      }
    ]
  };
  map = new google.maps.Map(document.getElementById('map'), mapOptions);

  createKMLWalks();
  getPlaces(latVar, lonVar);

  //Map drawing initialisation
      var drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: false
      }); 
      drawingManager.setMap(map);

      //draw water markers
      var waterIcon = {
          url: "images/Icons-water.png", // url
          scaledSize: new google.maps.Size(30, 30), // scaled size
          origin: new google.maps.Point(0, 0), // origin
          anchor: new google.maps.Point(15, 15) // anchor
      };
      var placeWater = document.getElementById('placeWater');
      if(window.innerWidth < 1100) {
        placeWater = document.getElementById('placeWaterMob');
      }
      placeWater.addEventListener('click', (function() {
        // closure handles local toggle variables
          var toggled = false;
          return function (e) {
            if (toggled) {
                drawingManager.setDrawingMode(null);
            } else {
                drawingManager.setDrawingMode(google.maps.drawing.OverlayType.MARKER);
                drawingManager.setOptions({markerOptions:
                                           {icon:waterIcon}
                                          });
            }
            toggled = !toggled;
          }
      })());

      //draw bin markers
      var binIcon = {
          url: "images/Icons-bin.png", // url
          scaledSize: new google.maps.Size(30, 30), // scaled size
          origin: new google.maps.Point(0, 0), // origin
          anchor: new google.maps.Point(15, 15) // anchor
      };
      var placeBin = document.getElementById('placeBin');
      if(window.innerWidth < 1100) {
        placeBin = document.getElementById('placeBinMob');
      }
      placeBin.addEventListener('click', (function() {
        // closure handles local toggle variables
          var toggled = false;
          return function (e) {
            if (toggled) {
              drawingManager.setDrawingMode(null);
            } else {
                drawingManager.setDrawingMode(google.maps.drawing.OverlayType.MARKER);
                drawingManager.setOptions({markerOptions:
                                           {icon:binIcon}
                                          });
            }
            toggled = !toggled;
          }
      })());
      

      //draw hazard marker
      var hazardIcon = {
          url: "images/Icons-walking hazard.png", // url
          scaledSize: new google.maps.Size(30, 30), // scaled size
          origin: new google.maps.Point(0, 0), // origin
          anchor: new google.maps.Point(15, 15) // anchor
      };
      var placehazard = document.getElementById('placeHazard');
      if(window.innerWidth < 1100) {
        placeHazard = document.getElementById('placeHazardMob');
      }
      placeHazard.addEventListener('click', (function() {
        // closure handles local toggle variables
          var toggled = false;
          return function (e) {
            if (toggled) {
                drawingManager.setDrawingMode(null);
            } else {
                drawingManager.setDrawingMode(google.maps.drawing.OverlayType.MARKER);
                drawingManager.setOptions({markerOptions:
                                           {icon:hazardIcon}
                                          });
            }
            toggled = !toggled;
          }
      })());

      //draw new route
      var placeWalk = document.getElementById('placeWalk');
      if(window.innerWidth < 1100) {
        placeWalk = document.getElementById('placeWalkMob');
      }
      placeWalk.addEventListener('click', (function() {
        // closure handles local toggle variables
        var toggled = false;
        return function (e) {
          if (toggled) {
            document.getElementById('saveRouteForm').style.display = "none";
            document.getElementById('savePathMob').style.display = "none";
            drawingManager.setDrawingMode(null);
          } else {
            if(window.innerWidth < 1100) {
              document.getElementById('savePathMob').style.display = "block";
            }
            else {
              document.getElementById('saveRouteForm').style.display = "block";
            }
            drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
            drawingManager.setOptions({polylineOptions:
                                         {strokeColor: "#02BC74", strokeWeight: 2}});
          }
          toggled = !toggled;
        }
      })());

    google.maps.event.addListener(drawingManager, 'markercomplete', function(marker) {
      console.log(marker.getIcon().url);
      var newLocation = (marker.getPosition().lat() + "," + marker.getPosition().lng());
      var userRef = dbMarkers.child(userID);
      var newMarkerRef = userRef.child(new Date().getTime());
      newMarkerRef.set({
        loc: newLocation,
        icon: marker.getIcon().url
      });
    });

    var routeLines = [];
    google.maps.event.addDomListener(drawingManager, 'polylinecomplete', function (polyline) {
      routeLines.push(polyline);
    });

    var saveButton = document.getElementById('saveRouteForm');
    if(window.innerWidth < 1100) {
      saveButton = document.getElementById('savePathMob');
    }
    saveButton.addEventListener('submit', (e) => {
      e.preventDefault();

      var name;
      if(saveButton['routeName'] != null) {
        name = saveButton['routeName'].value;
      }
      else { 
        name = new Date().getTime();  
      }
      
      var userRef = dbWalks.child(userID);
      var newWalkRef = userRef.child(name);

      for(var i = 0; i < routeLines[0].getPath().getLength(); i++) {
        var loc = routeLines[0].getPath().getAt(i).toUrlValue(6);
        var pathlocations = routeLines[0].getPath().getAt(i).toUrlValue(6);
        newWalkRef.child(i).set({loc});
      }
      routeLines = [];
    });
}

function getPlaces(lat, lng) {
  axios.get('https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
    params:{
      location: lat + "," + lng,
      radius: '5000',
      type: 'park',
      key: 'AIzaSyCCv1Dspw7_tmd_7VA1T1tZYl2ayF-isfE'
    }
  })
  .then(function(response){
    // Send fetched response data to create markers
    createMarkers(response.data);
  })
  .catch(function(error){
    console.log(error);
  });
}

function createMarkers(data) {
  for (var i = 0; i < data.results.length; i++) {
    var icon = {
      url: "images/Icons-park.png", // url
      scaledSize: new google.maps.Size(35, 35), // scaled size
      origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(17, 17) // anchor
    };

    var infoString =  `<h3>${data.results[i].name}</h3>`+ 
                      `<p>${data.results[i].vicinity}</p>`;
    var infoWindow = new google.maps.InfoWindow({
      content: infoString
    });

    var marker = new google.maps.Marker({
      position: data.results[i].geometry.location,
      map: map,
      icon: icon,
      title: data.results[i].place_id
    });

    var doesnotExist = false;

    dbParks.child(data.results[i].place_id).once('value', snapshot => {
      if(snapshot.exists()){} //skips next check if it already exists 
      else{ doesnotExist = true;  }
    });

    if(doesnotExist = true) {
      var newdatabaseRef = dbParks.child(data.results[i].place_id);
        newdatabaseRef.set({
          name: data.results[i].name,
          location: data.results[i].geometry.location,
          vicinity: data.results[i].vicinity
      });
    }
    addMarkerListener(marker, infoWindow);
  }
}

function drawUserWalks() {
  var routeArray = [];

  dbWalks.on('value', function(snapshot) {
    snapshot.forEach((user) => {
      if(user.key == userID) {
        user.forEach((walk) => {
          walk.forEach((location) => {
            routeArray.push(location.val().loc);
          });

          var walkArray = [];

          for(var i=0; i<routeArray.length; i++){
            var loc = routeArray[i].split(",");
            walkArray[i] = new google.maps.LatLng(loc[0], loc[1]);
          }

          var flightPath = new google.maps.Polyline({
            path: walkArray,
            strokeColor:"#4285f4",
            strokeOpacity:0.8,
            strokeWeight:2
          });
          flightPath.setMap(map);
          userWalks.push(flightPath);

          routeArray = [];
        });
      }
    });
  });  
}

function drawUserMarkers() {
  dbMarkers.on('value', function(snapshot) {
    snapshot.forEach((user) => {
      if(user.key == userID) {
        user.forEach((data) => {
          var newicon = {
              url: data.val().icon, // url
              scaledSize: new google.maps.Size(30, 30), // scaled size
              origin: new google.maps.Point(0, 0), // origin
              anchor: new google.maps.Point(15, 15) // anchor
          };

          var loc = data.val().loc.split(",");
          var location = new google.maps.LatLng(loc[0], loc[1]);

          var marker = new google.maps.Marker({
            position: location,
            map: map,
            icon: newicon,
          });

          userWalks.push(marker);
        });
      }
    });
  });
}

var addMarkerListener = function(marker, infoWindow) {
  google.maps.event.addListener(marker, 'click', function() {
    selected = marker;
    //checkDatabase(marker);
    infoWindow.open(map, marker);

    // Listen to form submit
   // document.getElementById('userForm').addEventListener('submit', submitForm);
    //document.getElementById('dogForm').addEventListener('submit', submitForm);
  });
}

function createKMLWalks() {
  var ctaLayer = new google.maps.KmlLayer({
    url: 'https://docs.google.com/uc?id=1XPoU4HsYkHV0J6oyIKx248cTQA9_UEQ5&amp;export=kmz',
    map: map,
    fill: "#02BC74",
    preserveViewport: true,
  });
}

//Find marker data in the database
function checkDatabase(marker) {
  var newParksRef = dbParks.child(marker.title);

  /*return newParksRef.child("dog-friendly").once('value').then(function(snapshot) {
    document.getElementById("printDog").innerText = ("Is Dog Friendly: " + snapshot.val());
  });*/
}

// Catch form submit
function submitForm(e) {
  e.preventDefault();

  // Get values
  var name = getInputVal('name');
  if(name != "") {
    updateName(name);
  }
  var toggle = getInputVal('dogFriendly');
  if(toggle != "" && (toggle == "yes" || toggle == "no")) {
    addDogFriendly(toggle);
  }
}

// Function to get form values
function getInputVal(id) {
  return document.getElementById(id).value;
}

// Save form values to database
function addDogFriendly(toggle) {
  var change = {};
  change["/dog-friendly"] = toggle;
  return dbParks.child(selected.title).update(change);
}

//listen for auth state change
auth.onAuthStateChanged(user => {
  if(user) {
    var u = fs.collection('users').doc(user.uid);
    userID = u.id;

    drawUserWalks();
    drawUserMarkers();
  }
  else {
    userID = null;
    for(var i=0; i<userWalks.length; i++) {
      userWalks[i].setMap(null);
    }
    userWalks = [];
  }
});

function changeAddMarkers() {
  const desktop = document.getElementById('addMarkersContainerDesktop');
  const mobile = document.getElementById('addMarkersContainerMobile');

  if(window.innerWidth < 1100) {
    mobile.style.display = "flex";
    desktop.style.display = "none";
  }
  else {
    mobile.style.display = "none";
    desktop.style.display = "flex";
  }
}