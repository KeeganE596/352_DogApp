function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(initializeMap);
  }
}

var map;
// Reference database markers collection
var databaseRef;
var selected;

var drawRoute = false;

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
  initializeFirebase();
  getPlaces(latVar, lonVar);
  //document.getElementById('drawButton').addEventListener('click', drawRoute);

  //Drawing route stuff
  var drawingTool =   new google.maps.drawing.DrawingManager();
      var drawingManager = new google.maps.drawing.DrawingManager({
          drawingMode: google.maps.drawing.OverlayType.MARKER,
          drawingControl: true,
          markerOptions: {icon: 'images/drop.png'},
          drawingControlOptions: {
          position: google.maps.ControlPosition.BOTTOM_CENTER,
          drawingModes: ['marker']
          },
        });

        drawingManager.setMap(map);

        var drawingManager = new google.maps.drawing.DrawingManager({
          drawingMode: google.maps.drawing.OverlayType.MARKER,
          drawingControl: true,
          markerOptions: {icon: 'images/hazard.png'
                         },
          drawingControlOptions: {
          position: google.maps.ControlPosition.BOTTOM_CENTER,
          drawingModes: ['marker']
          },
            
        });
    
        drawingManager.setMap(map);
    
        var drawingManager = new google.maps.drawing.DrawingManager({
          drawingMode: google.maps.drawing.OverlayType.MARKER,
          drawingControl: true,
          markerOptions: {icon: 'images/bin.png'
                         },
          drawingControlOptions: {
          position: google.maps.ControlPosition.BOTTOM_CENTER,
          drawingModes: ['marker']
          },
        });
            drawingManager.setMap(map);
    
  var drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.POLYLINE,
    polylineOptions: {strokeColor: "#02BC74",
                     strokeWeight: 2},
    drawingControl: true,
    drawingControlOptions: {
    position: google.maps.ControlPosition.BOTTOM_CENTER,
    drawingModes: ['polyline']
    },
  });
    
  drawingManager.setMap(map);

  var Lines = [];
      google.maps.event.addDomListener(drawingManager, 'polylinecomplete', function (polyline) {
      Lines.push(polyline);
  });

  google.maps.event.addDomListener(savebutton, 'click', function () {
      document.getElementById("savedata").value = "";
      for (var i = 0; i < Lines.length; i++) {
          //document.getElementById("savedata").value += "Path";
          document.getElementById("savedata").value +=
           Lines[i].getPath().getArray().toString();
          document.getElementById("savedata").value += "";
      }
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
    var marker = new google.maps.Marker({
      position: data.results[i].geometry.location,
      map: map,
      icon: 'images/markerTest.png',
      title: data.results[i].place_id
    });

    var databaseRef = firebase.database().ref('parks');
    var doesnotExist = false;

      databaseRef.child(data.results[i].place_id).once('value', snapshot => {
        if(snapshot.exists()){
          //console.log("exists");
        } 
        else{
          //console.log("doesnt exist");
          doesnotExist = true;
          //console.log(doesnotExist);
        }
      });

      if(doesnotExist = true) {
        //console.log("adding");
        var newdatabaseRef = databaseRef.child(data.results[i].place_id);
          newdatabaseRef.set({
            name: data.results[i].name,
            location: data.results[i].geometry.location,
            vicinity: data.results[i].vicinity
          });
      }

    addMarkerListener(marker);
  }
}

var addMarkerListener = function(marker) {
  google.maps.event.addListener(marker, 'click', function() {
    selected = marker;
    checkDatabase(marker);
    // Listen to form submit
    document.getElementById('userForm').addEventListener('submit', submitForm);
    document.getElementById('dogForm').addEventListener('submit', submitForm);
  });
}

function createKMLWalks() {
  var ctaLayer = new google.maps.KmlLayer({
    url: 'https://docs.google.com/uc?id=1JEOLocypIasBryadPwMe7vVt7AFJopms&amp;export=kml',
    map: map,
    fill: "#02BC74",
    preserveViewport: true
  });

  //map.data.loadGeoJson(
  //          'https://drive.google.com/file/d/1l6lewaNrQDY1PF2Sa-aYzxWh7EcBzGRH/view?usp=sharing');
}

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
  databaseRef = firebase.database().ref('parks');
  selected = null;
  addGeo();
}

//Find marker data in the database
function checkDatabase(marker) {
  var newRef = databaseRef.child(marker.title);

  newRef.child("name").once('value').then(function(snapshot) {
    document.getElementById("printName").innerText = snapshot.val();
  });
  newRef.child("vicinity").once('value').then(function(snapshot) {
    document.getElementById("printAddy").innerText = snapshot.val();
  });
  newRef.child("location").child("lat").once('value').then(function(snapshot) {
    document.getElementById("printLocLat").innerText = ("lat: " + snapshot.val() + ", ");
  });
  newRef.child("location").child("lng").once('value').then(function(snapshot) {
    document.getElementById("printLocLng").innerText = ("lng: " + snapshot.val());
  });
  return newRef.child("dog-friendly").once('value').then(function(snapshot) {
    document.getElementById("printDog").innerText = ("Is Dog Friendly: " + snapshot.val());
  });
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
function updateName(name) {
  var change = {};
  change["/name"] = name;
  return databaseRef.child(selected.title).update(change);
}

// Save form values to database
function addDogFriendly(toggle) {
  var change = {};
  change["/dog-friendly"] = toggle;
  return databaseRef.child(selected.title).update(change);
}

function addGeo() {
  var geoObj = '{"type":"Feature","properties":{"FID":77,"objectid":55,"id":1,"name":"Maupuia Walkway (Old Prison Rd)","road_front":"yes","suburb":"Maupuia","se_area_sh":0,"se_length_":0,"On_Off":"Off leash","Details":"Off leash under control of owner","GlobalID":"d703a145-3fae-4337-8bfd-621ee3079341"},"geometry":{"type":"Polygon","coordinates":[[[174.81480874934,-41.3086560534277],[174.814972505029,-41.3086667628995],[174.81519387956,-41.3086813510177],[174.815447754239,-41.3086980316319],[174.81548486544,-41.3087010350867],[174.81573090142,-41.3086651859331],[174.815526943426,-41.3085674659],[174.815293330248,-41.3085382632926],[174.815225453545,-41.3085297623671],[174.815251485824,-41.3084922295328],[174.815114679593,-41.3085058662447],[174.815219764515,-41.3083162975424],[174.815272567487,-41.3082307460941],[174.815306184242,-41.3081901758701],[174.815348167007,-41.3081571666168],[174.815392161998,-41.308122593863],[174.81545823129,-41.3080738053232],[174.815504296898,-41.308040731906],[174.815546293137,-41.3080077306745],[174.815577515882,-41.3079548676685],[174.815596319417,-41.3078960401479],[174.815600590008,-41.307828199391],[174.815590501927,-41.3077590339473],[174.815566475587,-41.3077024175447],[174.815544913325,-41.3076611721992],[174.815519270017,-41.3076199814859],[174.815478770371,-41.3075590024206],[174.815448195312,-41.307487088253],[174.81543824647,-41.3074225501934],[174.815436845996,-41.3073717387668],[174.815449780838,-41.3073222438282],[174.815475217534,-41.3072817931527],[174.815515085664,-41.3072457448284],[174.815579144527,-41.3071985272359],[174.815649466444,-41.3071558327804],[174.815685505057,-41.3071290858066],[174.815711282214,-41.3071009507612],[174.815738391573,-41.307046611909],[174.815759448981,-41.3069954499684],[174.815781614013,-41.3069103866921],[174.815800035764,-41.3068377025357],[174.81581425879,-41.3067604559615],[174.815830002664,-41.306664712946],[174.81584204458,-41.3065828801995],[174.815858594243,-41.3065163856611],[174.815883322167,-41.3064497641915],[174.815925775649,-41.3063597538738],[174.815970494683,-41.3062774166637],[174.816005799372,-41.3062244901724],[174.816059237453,-41.3061620387199],[174.816099060668,-41.3061244424402],[174.816159162452,-41.3060819166585],[174.816275898523,-41.3060184710746],[174.816382584243,-41.3059613450284],[174.816444823119,-41.3059218564637],[174.816484519671,-41.3058796409629],[174.816526076635,-41.3058312461844],[174.816559224469,-41.3057737326319],[174.816578110649,-41.3057179829895],[174.816580964597,-41.3056732658238],[174.816577351573,-41.3056163290979],[174.816569105038,-41.3055394434522],[174.816550904273,-41.3054719457489],[174.816545378735,-41.3054196590041],[174.816550272757,-41.3053749186901],[174.816561248373,-41.3053285344913],[174.816586260165,-41.3052726886443],[174.816619705342,-41.305225951443],[174.816659389318,-41.3051837368414],[174.816713207386,-41.3051351492229],[174.816763152818,-41.3050943132185],[174.816849251846,-41.3050313484951],[174.81691293701,-41.3049702759081],[174.816996824386,-41.3049011850372],[174.817134601696,-41.3047865766551],[174.81721040693,-41.3047206923496],[174.817256185077,-41.3046768416483],[174.817358148353,-41.3045966860452],[174.817442258511,-41.3045352837364],[174.817482070048,-41.3044976952915],[174.817516150333,-41.3044740500762],[174.81756255281,-41.3044533005306],[174.817607094875,-41.304438739809],[174.817696252666,-41.3044126894911],[174.817765166923,-41.3043931262711],[174.817819662322,-41.3043691692479],[174.817859727184,-41.3043408089689],[174.817949355693,-41.3042577660386],[174.818038727284,-41.3041654785215],[174.818111727079,-41.3040719161201],[174.818153037904,-41.3040142741477],[174.818192763202,-41.303973598051],[174.818232754402,-41.3039421590199],[174.818282954057,-41.3039105681365],[174.81836164917,-41.3038754404437],[174.818468669962,-41.3038306369855],[174.818557401054,-41.3037891914649],[174.818621593766,-41.3037465906033],[174.818675322901,-41.3036949131997],[174.818746448811,-41.3036075410571],[174.818783706437,-41.3035515020829],[174.818830971296,-41.3034876059459],[174.818878278375,-41.3034252490486],[174.818939864176,-41.3033626673709],[174.81902792782,-41.3032965906475],[174.819073860477,-41.3032588968886],[174.819101475587,-41.303223031246],[174.819128823898,-41.3031779385084],[174.819173907647,-41.3031094470209],[174.819205307359,-41.3030627501092],[174.819234994883,-41.3030283919529],[174.81926498963,-41.3030048190876],[174.819311136086,-41.3029748224001],[174.819385619,-41.3029351491446],[174.819486525857,-41.3028904307454],[174.819698238109,-41.3028010464926],[174.819612846054,-41.3027336775492],[174.81957674456,-41.3027549958602],[174.819532330954,-41.3027741843587],[174.819372988687,-41.3028475424886],[174.819282216623,-41.3028890203253],[174.819229892452,-41.3029175654674],[174.819185957648,-41.302953687043],[174.81914834878,-41.3029974106832],[174.819069355426,-41.303095688384],[174.818980114091,-41.3031925953387],[174.818902652364,-41.3032723673351],[174.818820682891,-41.3033368089518],[174.818771164159,-41.3033930397641],[174.818692339688,-41.3034974835191],[174.818645203288,-41.3035659982184],[174.818581532497,-41.3036270727955],[174.8185056015,-41.3036883389683],[174.818437242402,-41.3037279240372],[174.818330209932,-41.3037727370136],[174.81821077083,-41.3038115763412],[174.818157164764,-41.3038361496913],[174.818112285831,-41.3038701153446],[174.818062608995,-41.3039201878601],[174.818029420737,-41.3039761624085],[174.818006579275,-41.3040365948379],[174.817961609612,-41.3041096957872],[174.817914525314,-41.3041797491277],[174.817848928536,-41.3042454814687],[174.817784820265,-41.3042911517954],[174.817708420347,-41.304335483233],[174.817627555802,-41.3043660238799],[174.817540438982,-41.3043920337269],[174.817477776999,-41.3044161189587],[174.8174012073,-41.3044542925247],[174.817320936541,-41.304506385019],[174.817218975061,-41.3045865407331],[174.817169156292,-41.3046319948772],[174.817075487161,-41.304716640711],[174.81698151889,-41.3047905182934],[174.816817221517,-41.3049070829754],[174.816691097152,-41.3049999383164],[174.816627115545,-41.3050502346794],[174.816519566544,-41.3051505080996],[174.816474181859,-41.3052082125005],[174.816448946386,-41.3052563621079],[174.816436013341,-41.3053058484925],[174.816433542076,-41.30536442057],[174.816439196072,-41.3054213251248],[174.816454669553,-41.3055381498324],[174.816454835741,-41.3056182509679],[174.816434416136,-41.3056925054242],[174.816391315867,-41.3057594164873],[174.816347802373,-41.3058109316496],[174.816287944033,-41.3058627031994],[174.816223536623,-41.3058976057845],[174.816140585292,-41.3059266287253],[174.816043512444,-41.3059620421075],[174.815966728945,-41.3059925091131],[174.815906531041,-41.3060319652443],[174.815846417579,-41.3060744903837],[174.815802692082,-41.3061183084291],[174.815763460857,-41.3061774580874],[174.815732663016,-41.3062457148936],[174.815700701857,-41.3063463420984],[174.815686490509,-41.3064235790411],[174.815686485119,-41.3064975228449],[174.815692350219,-41.3065621252517],[174.815710592308,-41.3066311536304],[174.81571938951,-41.3067280607294],[174.815705305723,-41.3068099169118],[174.8156848421,-41.3068826321399],[174.815662082384,-41.3069461430133],[174.815630677282,-41.3069928479408],[174.815586994006,-41.3070382059356],[174.815506887639,-41.3070964545781],[174.815396358927,-41.3071628810452],[174.815307577529,-41.3072027858832],[174.815236916049,-41.3072331558131],[174.815182503295,-41.3072601996548],[174.815154556707,-41.3072837392664],[174.815133074395,-41.307319508204],[174.815130051564,-41.307358057956],[174.815137279409,-41.3073979964144],[174.815154545927,-41.3074316174164],[174.815203283124,-41.3074955481521],[174.815277296219,-41.3075868032456],[174.815351477298,-41.3076842264902],[174.815404947719,-41.3077711923441],[174.815426847747,-41.3078247532331],[174.815432586185,-41.307884736734],[174.815427987709,-41.3079402618431],[174.815407226745,-41.3080022014517],[174.815373822891,-41.3080504778805],[174.815336008309,-41.3080865021424],[174.815284187195,-41.308133527452],[174.815246456157,-41.3081726212763],[174.815200929538,-41.3082257081351],[174.815167706246,-41.308280142499],[174.815115073055,-41.3083718526493],[174.815032621187,-41.3084932916431],[174.814991134292,-41.3085447749549],[174.81495910486,-41.3085683782071],[174.814892779548,-41.3086079299483],[174.81480874934,-41.3086560534277]]]}}';
  //var stupid = 'http://localhost:8888/Desktop/Dog_Exercise__Restriction_Layer.geojson'
  var parsed = JSON.parse(geoObj);

  var databaseRef2 = firebase.database().ref('walks');
  databaseRef2.child('Maupuia Walkway (Old Prison Rd)').set(parsed);
  //console.log("added geo stuff");
}

function drawRoute() {
  drawRoute = true;
}

function loadPolygons(map ){
  var data = JSON.parse(Window.localStorage.getItem('Dog_Exercise__Restriction_Layer'));
  console.log(data);

  map.data.addGeoJson(data);
}

