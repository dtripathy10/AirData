
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
        .state('info.regionalMarket', {
            url: '/regionalMarket',
            templateUrl: 'partials/regionalMarket.html',
            controller: 'RegionalMarketController'
        })
        .state('info.ok', {
            url: '/ok',
            templateUrl: 'partials/ok.html',
            controller: 'okController'
        });
    $urlRouterProvider.otherwise('info.regionalMarket');
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

app.controller('RegionalMarketController', function($scope, $http) {

  lok_p = [];
  var counter = 1;
  for (var key in data) {
       if (data.hasOwnProperty(key)) {
          var tempObject = {};
          tempObject["id"] = counter;
          counter++;
          tempObject["name"] = key;
          lok_p.push(tempObject);
        }
  }

  $scope.data = lok_p;

  $scope.form = {type : $scope.data[0].name};

  $scope.names = [];

  $scope.selectAction = function() {
    $scope.names = [];
    var _counter = 1;
    if(window.data[$scope.form.type.name]) {
        for (var i = 0; i < data[$scope.form.type.name]['regional_maket'].length; i++) {
          var _tempObject1 = {};
          _tempObject1["id"] = _counter;
          _counter++;
          _tempObject1["regional_maket"] = data[$scope.form.type.name]['regional_maket'][i];
          _tempObject1["district_name"] = $scope.form.type.name;
          $scope.names.push(_tempObject1);
        }
      }
    console.log($scope.form.type);
  };

  $scope.findAllRM = function() {
    $scope.names = [];
    var _counter = 1;
       for (var key in window.data) {
          for (var i = 0; i < window.data[key]['regional_maket'].length; i++) {
          var _tempObject1 = {};
            _tempObject1["id"] = _counter;
            _counter++;
            _tempObject1["regional_maket"] = data[key]['regional_maket'][i];
            _tempObject1["district_name"] = key;
            $scope.names.push(_tempObject1);
        }
      }
    console.log($scope.form.type);
  };
  $scope.findAllRM();
});

app.controller('okController', function($scope, $rootScope) {
});


