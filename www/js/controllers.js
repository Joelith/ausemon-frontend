angular.module('starter.controllers', ['app.services', 'ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, mcsService) {
  console.log('app ctrl called');

 
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

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
.controller('animalsCtrl', function($scope,mcsService) {
  console.log('animals Ctrl called');
   //mcsService.authenticateAnonymous()
   // .then(function() {

      $scope.animals = [{
        id: 1,
        pretty_name: "Kangaroo",
        description: "A marsupial"
      },{
        id:21,
        pretty_name:"Wombat",
        description: "Something"
      }];
    /*  mcsService.invokeCustomAPI("Animals/animals" , "GET" , null)
      .then (function(data) {
            $scope.animals = data;          
      })
      .catch(function(err) {
          console.log('Error calling endpoint Animals/animals: '+err);
      });     */
  //  })

})
.controller('MapCtrl', function($scope, $state, $cordovaGeolocation) {
  var options = {timeout: 10000, enableHighAccuracy: true};

console.log($cordovaGeolocation.getCurrentPosition);
  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
    console.log('postition');
    console.log(position);
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var mapOptions = {
        zoom: 13,
        center: latLng,
        streetViewControl: false,
        draggable: false, 
        zoomControl: false, 
        scrollwheel: false, 
        disableDoubleClickZoom: true,
        clickableIcons: false,
        disableDefaultUI : true,            
        mapTypeId: 'terrain'
    }; 

    var image = 'img/ff000.png';
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    $scope.map.data.loadGeoJson('geo/cct1.geojson');
    $scope.map.data.loadGeoJson('geo/cct2.geojson'); 
console.log('loaded', $scope.map.data);
    //Wait until the map is loaded
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){ 
      var marker = new google.maps.Marker({
          position: latLng,
          map: $scope.map,
          icon: image
      });      

      var infoWindow = new google.maps.InfoWindow({
          content: "Here I am!"
      });

      google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open($scope.map, marker);
      });

    });

  }, function(error){
    console.log("Could not get location");
  });
});



