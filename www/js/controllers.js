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
.controller('MapBoxCtrl', function($scope, $ionicLoading, $cordovaGeolocation, $ionicModal, mcsService) {
  $scope.nearby_title = "Nothing nearby";
  $scope.nearby_class = "bar-stable";
  $scope.animals = [];
  $ionicLoading.show({
      template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Keep your eyes open, <br/>you might miss something!'
  });

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

  var moveMap = function (lat, lon) {
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
    marker.setLngLat([lon,lat]);  
    if (!marker_added_to_map) marker.addTo(map);

    map.setCenter([lon, lat]);

  }
  mapboxgl.accessToken = 'pk.eyJ1Ijoiam9lbGl0aCIsImEiOiJjaXJoMTRrcG4wMWIzZnlreGo1ZnhtN3psIn0.phwvU2Rgcy-oa8n-hZx16A';
  var map = new mapboxgl.Map({
    container : 'map',
    style: 'mapbox://styles/joelith/cirh1bcq00003gfnev58pm1de',
    center: [149.091, -35.2438],
    zoom: 14,
    bearing: -60,
    pitch : 75.00
  });
  // Prepare the marker
  var el = document.createElement('span');
  el.className = 'map-icon map-icon-trail-walking';
  el.style['font-size'] = '30pt';
  var marker = new mapboxgl.Marker(el);
  var marker_added_to_map = false;
 
  var watch = $cordovaGeolocation.watchPosition({
    timeout : 3000,
    enableHighAccuracy : true
  });
  watch.then(null, function (error) {
    console.log('Error getting position', error);
  }, function (position) {
    moveMap(position.coords.latitude, position.coords.longitude)
  });

  map.on('load', function () {
    $ionicLoading.hide();                          
  });
 
  map.boxZoom.disable();
  map.dragPan.disable();
  map.doubleClickZoom.disable();
  map.scrollZoom.disable();
  map.keyboard.disable();
  map.touchZoomRotate.disable();


  $scope.demoMap = function () {
    var positions = [
      [-35.246765, 149.090998],
      [-35.248438, 149.090526],
      [-35.249078, 149.092849],
      [-35.250900, 149.093852]
    ];
    var i = 0, l = positions.length;
    (function iterator() {
      console.log('moving map to', positions);
      moveMap(positions[i][0], positions[i][1]);
      if (++i<l) setTimeout(iterator, 10000)
    })();
  }
});