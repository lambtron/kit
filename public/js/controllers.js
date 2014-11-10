'use strict';



/**
 * To send email and interface with oauth for Google services.
 *
 */
kitt.controller('startController',
  ['$scope', '$http', '$routeParams', '$location',
  function ($scope, $http, $routeParams, $location)
{
  // Save email, get URL
  var oauth = $scope.oauth = {
    email: '',


    /**
     * Initiate oauth process.
     *
     * email, string
     *
     * returns data object
     *   url, string
     */
    connect: function connect() {
      $http.post('/api/oauth', {email: this.email})
        .success(function(err, data) {
          $location.path(data.url);
        })
        .error(function(err, data) {
        });
    }
  };

}]);



/**
 * To save contacts (email, interval) per user.
 *
 */
kitt.controller('setupController',
  ['$scope', '$http', '$location',
  function ($scope, $http, $location)
{
  var setup = $scope.setup = {
    contacts: [],
    email: '',
    code: '',


    /**
     * Save user and oauth codes in database.
     */
    saveUser: function saveUser() {
      var load = {
        email: this.email,
        code: this.code
      };
      $http.post('/api/user', load)
        .success(function(err, data) {
          setup.getContacts();
        })
        .error(function(err, data) {
        });
    },


    /**
     * Get email from query string.
     *
     */
    setEmail: function setEmail() {
      var qs = $location.search();
      this.email = qs.state || '';
    },


    /**
     * Get code from query string.
     *
     */
    setCode: function setCode() {
      var qs = $location.search();
      this.code = qs.code || '';
    },


    /**
     * Get contacts from API.
     *
     * @return {array of contacts objects}
     */
    getContacts: function getContacts() {
      if (this.email.length == 0) return;
      $http.post('/api/contacts', {email: 'andyjiang@gmail.com'})
        .success(function(err, data) {
          console.log(data);
          setup.contacts = data.contacts;
        })
        .error(function(err, data) {
        });
    },


    /**
     * Save contacts to API.
     *
     * array of contacts objects
     */
    saveContacts: function saveContacts() {
      if (this.email.length == 0) return;
      $http.post('/api/contacts', {email: this.email, contacts: this.contacts})
        .success(function(err, data) {
        })
        .error(function(err, data) {
        });
    }
  };

  setup.setEmail();
  setup.setCode();
  setup.saveUser();
}]);