kitt.config( ['$routeProvider', '$locationProvider',
function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider.
  when('/', {
    templateUrl: 'public/views/pages/index.html',
    controller: 'indexController'
  }).
  when('/setup', {
    templateUrl: 'public/views/pages/setup.html',
    controller: 'setupController'
  }).
  otherwise({
    redirectTo: '/'
  });
}]);