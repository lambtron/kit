'use strict';



/**
 * To send email and interface with oauth for Google services.
 *
 */
kitt.controller('startController',
  ['$scope', '$http', '$routeParams', '$location', '$window',
  function ($scope, $http, $routeParams, $location, $window)
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
        .success(function(data) {
          $window.location.href = data.url;
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
    frequencies: [0,1,2,3,4,5,6],
    periods: ['week','month'],


    /**
     * Save user and oauth codes in database.
     *
     */

    saveUser: function saveUser() {
      var load = {
        email: this.email,
        code: this.code
      };
      $http.post('/api/user', load)
        .success(function(err, data) {
          setup.getContacts();
          console.log('success');
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
      $http.post('/api/contacts', {email: this.email})
        .success(function(data) {
          if (data && data.feed)
            setup.addContacts(data.feed.entry);
        })
        .error(function(err) {
        });
    },

    /**
     * Add contacts to this.contacts.
     *
     * @param {array} contacts
     */

    addContacts: function addContacts(contacts) {
      contacts.forEach(function(contact) {
        var newContact = {
          email: contact.gd$email[0].address,
          frequency: null // in days
        };
        setup.contacts.push(newContact);
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