kitt.config( ['$routeProvider', '$locationProvider',
function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider.
  when('/', {
    templateUrl: 'public/views/pages/start.html',
    controller: 'startController'
  }).
  when('/oauth2callback', {
    templateUrl: 'public/views/pages/setup.html',
    controller: 'setupController'
  }).
  otherwise({
    redirectTo: '/'
  });
}]);