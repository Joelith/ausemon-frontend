// Ionic Starter App
var Promise = window.Promise;
var _ = window._;
var $ = window.$
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform, mcsService) {

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})


.config(function($stateProvider, $urlRouterProvider) {
  var authenticated = function ($q, mcsService) {
    var deferred = $q.defer();
    if (mcsService.isLoggedIn()) {
      deferred.resolve();
    } else {
      mcsService.authenticateAnonymous().then(function () {
        deferred.resolve();
      }).catch(function(err) {
        deferred.reject();
      })
    }
    return deferred.promise;
  };
  
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl',
            resolve : {authenticated : authenticated }

  })

  /*.state('app.map', {
    url: '/map',
    views: {
      'menuContent': {
        templateUrl: 'templates/map.html',
        controller: 'MapCtrl',
      }
    }
  })*/
  .state('app.map', {
    url: '/map',
    views: {
      'menuContent': {
        templateUrl: 'templates/mapbox.html',
        controller: 'MapBoxCtrl',
      }
    }
  })


  .state('app.animals', {
    url: '/animals',
    views: {
      'menuContent': {
        templateUrl: 'templates/animals.html',
        controller: 'animalsCtrl'
      }
    },
  })

  .state('app.details', {
    url: '/animals/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/animalDetail.html',
       // controller: 'detailsCtrl'
      }
    }
  })
  .state('app.about', {
    url: '/about',
    views : {
      'menuContent': {
        templateUrl: 'templates/about.html'
      }
    }
  })
  .state('app.badges', {
    url: '/badges',
    views: {
      'menuContent': {
        templateUrl: 'templates/badges.html',
        controller: 'BadgesCtrl'
      }
    }
  })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/map');
});
