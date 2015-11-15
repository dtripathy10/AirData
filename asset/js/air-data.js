
var app = angular.module('myApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('info', {
            url: '/info',
            templateUrl: 'partials/info.html'
        })
        .state('info.distance', {
            url: '/distance',
            templateUrl: 'partials/distance.html',
            controller: 'distanceController'
        })
        .state('info.coutry', {
            url: '/coutry',
            templateUrl: 'partials/country.html',
            controller: 'countryController'
        })
        .state('info.ok', {
            url: '/ok',
            templateUrl: 'partials/ok.html',
            controller: 'okController'
        });
    $urlRouterProvider.otherwise('/ok');
});

app.controller('AppController', function($scope, $http) {
  $scope.title = "Homepage";
});

app.controller('mapController', function($scope, $http) {
});

app.controller('infoController', function($scope, $http) {
      $scope.title = "Homepage";
});

app.controller('distanceController', function($scope, $http, $location) {
});

app.controller('countryController', function($scope, $http) {

  var okm = [];
  var counter = 1;
  for (var key in data) {
       if (data.hasOwnProperty(key)) {
          var tempObject = {};
          tempObject["id"] = counter;
          counter++;
          tempObject["name"] = key;
          okm.push(tempObject);
        }
  }

  $scope.data = {
    repeatSelect: null,
    availableOptions: okm,
   };

  $scope.findRM = function() {
    alert(data.repeatSelect);
  };

  $scope.findAllRM = function() {

  };

});

app.controller('okController', function($scope, $rootScope) {
});


