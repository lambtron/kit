kitt.config( ['$routeProvider', '$locationProvider',
function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider

  /**
   * Default route.
   *
   */

  .when('/', {
    templateUrl: 'public/views/pages/start.html',
    controller: 'startController'
  })

  /**
   * Oauth callback route.
   *
   */

  .when('/oauth2callback', {
    templateUrl: 'public/views/pages/setup.html',
    controller: 'setupController'
  })

  /**
   * Catch all route.
   *
   */

  .otherwise({
    redirectTo: '/'
  });
}]);