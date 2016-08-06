angular.module('starter.controllers', ['app.services', 'ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, mcsService) {
  console.log('app ctrl called');

 
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  //mcsService.authenticateAnonymous();


  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };


})
.controller('animalsCtrl', function($scope,$ionicLoading,mcsService) {
  $ionicLoading.show({
    template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Getting information'
  });
  mcsService.invokeCustomAPI("Animals/animals" , "GET" , null)
  .then (function(data) {
    $ionicLoading.hide();                          
    $scope.animals = data.animals;          
  })
  .catch(function(err) {
      $ionicLoading.hide();                          
      console.log('Error calling endpoint Animals/animals: '+err);
  });     
})

.controller('MapCtrl', function($scope, $cordovaGeolocation, $ionicLoading, $ionicPlatform, $ionicModal, mcsService) {

  var lat, lon;
  //init the modal
  $ionicModal.fromTemplateUrl('modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal = modal;
  });

  // They are looking at an animal
  $scope.openModal = function (id) {
    $ionicLoading.show({
      template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Getting information'
    });
    mcsService.invokeCustomAPI("Animals/animals/" + id , "GET" , null)
    .then (function(data) {
      $ionicLoading.hide();                          
      $scope.modal.animal = data;
      $scope.modal.show();
      mcsService.logCustomEvent('ViewAnimal',{
        animal:data.name
      });
      mcsService.flushAnalyticsEvents();
    })
    .catch(function(err) {
      $ionicLoading.hide();                          
      console.log('Error calling endpoint Animals/animals: '+err);
    });

  };

  // function to close the modal
  $scope.closeModal = function () {
    $scope.modal.hide();
  };

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function () {
    $scope.modal.remove();
  });
    $ionicPlatform.ready(function() {
         
      $scope.nearby_title = "Nothing nearby";
      $scope.nearby_class = "bar-stable";
      $ionicLoading.show({
          template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Keep your eyes open, <br/>you might miss something!'
      });
       
      var posOptions = {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0
      };  

      var image = 'img/ff000.png';      

      $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
          mcsService.invokeCustomAPI("Animals/animals/nearby?lat=" + lat + "&lon=" + lon , "GET" , null)
          .then (function(data) {
            if (data.length > 0) {
              $scope.animals = data; 
              $scope.nearby_title = "Something is nearby"
              $scope.nearby_class = "bar-balanced"
            } else {
              $scope.nearby_title = "Nothing nearby";
              $scope.nearby_class = "bar-stable";
            }

          })
          .catch(function(err) {
              console.log('Error calling endpoint Animals/animals/nearby: '+err);
          });     

          //var latLong = new google.maps.LatLng(lat, lon);
          var latLong = new google.maps.LatLng(-35.311516972985451, 149.1212274874590);
          
          var styles = [
            {
              "stylers": [
                { "visibility": "simplified" }
              ]
            },{
              "stylers": [
                { "saturation": 72 },
                { "hue": "#004cff" }
              ]
            },{
              "featureType": "road",
              "stylers": [
                { "visibility": "simplified" }
              ]
            },{
              "featureType": "poi",
              "elementType": "labels",
              "stylers": [
                { "visibility": "off" }
              ]
            },{
              "featureType": "road",
              "elementType": "labels",
              "stylers": [
                { "visibility": "off" }
              ]
            },{
              "featureType": "landscape",
              "elementType": "labels",
              "stylers": [
                { "visibility": "off" }
              ]
            },{
              "featureType": "administrative",
              "elementType": "labels.text",
              "stylers": [
                { "visibility": "off" }
              ]
            },{
              "featureType": "water",
              "elementType": "labels",
              "stylers": [
                { "visibility": "off" }
              ]
            },{
              "featureType": "transit",
              "elementType": "labels",
              "stylers": [
                { "visibility": "off" }
              ]
            },{
            }
          ]

          var mapOptions = {
              zoom: 15,
              center: latLong,
              streetViewControl: false,
              zoomControl: false, 
              clickableIcons: false,
              disableDefaultUI : true,            
              styles: styles
          };                              
           
          var map = new google.maps.Map(document.getElementById("map"), mapOptions);          
           
          $scope.map = map;
          $scope.map.data.loadGeoJson('geo/cct1.geojson');
          $scope.map.data.loadGeoJson('geo/cct2.geojson');
          
          var marker = new google.maps.Marker({
            position: latLong,
            label: '#ff000',            
            map: $scope.map,
            draggable: true
          });         
      
          $ionicLoading.hide();                          
                
      }, function(err) {
          $ionicLoading.hide();
          console.log(err);
      });
    });               
})
.controller('MapBoxCtrl', function($scope) {
  mapboxgl.accessToken = 'pk.eyJ1Ijoiam9lbGl0aCIsImEiOiJjaXJoMTRrcG4wMWIzZnlreGo1ZnhtN3psIn0.phwvU2Rgcy-oa8n-hZx16A';
  var map = new mapboxgl.Map({
    container : 'map',
    style: 'mapbox://styles/joelith/cirh1bcq00003gfnev58pm1de',
    center: [149.091, -35.2438],
    zoom: 16,
    bearing: -9.47,
    pitch : 75.00
  });

  map.on('load', function () {
    map.addSource('points', {
      type : 'geojson',
      data : {
        type : 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: {
            type: "Point",
            coordinates: [149.091, -35.2438]
          },
          properties: {
            title: "Mapbox DC",
            icon: "circle"
          }
        }]
      }
    });
      map.addLayer({
        id: "markers",
        type: "symbol",
        source: "points",
        layout: {
            "icon-image": "{icon}-15"
        }
    });
  })


  /*map.boxZoom.disable();
  map.dragPan.disable();
  map.doubleClickZoom.disable();
  map.scrollZoom.disable();
  map.keyboard.disable();
  map.touchZoomRotate.disable();*/

  var geolocate = new mapboxgl.Geolocate({position: 'top-right' });
  map.addControl(geolocate);

  geolocate.on('geolocate', function() {
    // Apparently this get's reset on result :/
    map.setBearing(-9.47);
    map.setPitch(45.00);
  });

});