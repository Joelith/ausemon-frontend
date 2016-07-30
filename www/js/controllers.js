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

.controller('AnimalListCtrl2', function ($scope) {
    $scope.animalListItems = [{
        id: 1,
        pretty_name: "Kangaroo"
      },{
        id:21,
        pretty_name:"Wombat"
      }];  
})

.controller('AnimalListCtrl', function ($scope, $ionicModal) {

// array list which will contain the items added
$scope.animalListItems = [];

//init the modal
$ionicModal.fromTemplateUrl('modal.html', {
  scope: $scope,
  animation: 'slide-in-up'
}).then(function (modal) {
  $scope.modal = modal;
});

// function to open the modal
$scope.openModal = function () {
  $scope.modal.show();
};

// function to close the modal
$scope.closeModal = function () {
  $scope.modal.hide();
};

//Cleanup the modal when we're done with it!
$scope.$on('$destroy', function () {
  $scope.modal.remove();
});

$scope.animalListItems = [{
    id: 1,
    pretty_name: "Kangaroo"
  },{
    id:21,
    pretty_name:"Wombat"
  }];  

})

.controller('MapCtrl', function($scope, $cordovaGeolocation, $ionicLoading, $ionicPlatform, $ionicModal) {
     
    $ionicPlatform.ready(function() {
         
        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
        });
         
        var posOptions = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0
        };  

        var image = 'img/ff000.png';      

        $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
            var lat  = position.coords.latitude;
            var long = position.coords.longitude;
             
            var latLong = new google.maps.LatLng(lat, long);
             
            var mapOptions = {
                zoom: 25,
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
             
            var map = new google.maps.Map(document.getElementById("map"), mapOptions);          
             
            $scope.map = map;
            $scope.map.data.loadGeoJson('geo/cct1.geojson');
            $scope.map.data.loadGeoJson('geo/cct2.geojson');
            
            var marker = new google.maps.Marker({
              position: latLong,
              map: $scope.map,
              icon: image
            });                   
            
            $ionicLoading.hide();                          
                  
        }, function(err) {
            $ionicLoading.hide();
            console.log(err);
        });
    });               
});