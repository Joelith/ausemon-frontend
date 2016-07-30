var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
       //app.receivedEvent('deviceready');
       //navigator.geolocation.getCurrentPosition(app.onSuccess, app.onError);
       navigator.geolocation.watchPosition(app.onSuccess, app.onError, { timeout: 1000 });
    },

    onSuccess: function(position){
        var longitude = position.coords.longitude;
        var latitude = position.coords.latitude;
        var latLong = new google.maps.LatLng(latitude, longitude);
        var n = Date.now();
        var element = document.getElementById('coords');
        
        element.innerHTML = 'Time <br />' +  n + '<br />' +
                            'Latitude: <br />'  + position.coords.latitude + '<br />' +
                            'Longitude: <br />' + position.coords.longitude;

       var mapOptions = {
            zoom: 13,
            center: latLong,
            streetViewControl: false,
            draggable: false, 
            zoomControl: false, 
            scrollwheel: false, 
            disableDoubleClickZoom: true,
            clickableIcons: false,
            disableDefaultUI : true,            
            mapTypeId: 'terrain'
        };

        //check to see if currently location matches up with the trail data, if not, show a different screen.
        var onTrail = true;
           
        if (onTrail)
        {
            var map = new google.maps.Map(document.getElementById("map"), mapOptions);
            
            // this is temp geo data with national parks and additional markers.
            //map.data.loadGeoJson('geo/trail.json');
            map.data.loadGeoJson('geo/cct1.geojson');
            map.data.loadGeoJson('geo/cct2.geojson');

            var image = 'img/ff000.png';

            var marker = new google.maps.Marker({
                position: latLong,
                map: map,
                title: 'Centenary Trail',
                icon: image
            });
                      
        }

    },
        onError: function(error){
        alert("the code is " + error.code + ". \n" + "message: " + error.message);
    },
};

//actually do non app stuff here.
app.initialize();
setTimeout(showMap, 5000)

// alert dialog dismissed
function alertDismissed() {
    // do something
};

// Show a custom alertDismissed
//
function showAlert() {
    navigator.notification.alert(
        'There is something nearby',  // message
        alertDismissed,         // callback
        'Keep your eyes open!',            // title
        'Done'                  // buttonName
    );
};

function showMap()
{
      toggle(document.getElementById('splash'));
};

//from https://stackoverflow.com/questions/21070101/show-hide-div-using-javascript
function toggle (elements, specifiedDisplay) {
  var element, index;

  elements = elements.length ? elements : [elements];
  for (index = 0; index < elements.length; index++) {
    element = elements[index];

    if (isElementHidden(element)) {
      element.style.display = '';

      // If the element is still hidden after removing the inline display
      if (isElementHidden(element)) {
        element.style.display = specifiedDisplay || 'block';
      }
    } else {
      element.style.display = 'none';
    }
  }

  function isElementHidden (element) {
    return window.getComputedStyle(element, null).getPropertyValue('display') === 'none';
  }
  
};