'use strict';

(function () {
  var agent = require('superagent');
  var google = require('googleapis');
  var OAuth2Client = google.auth.OAuth2;

  // Client ID and client secret are available at
  // https://code.google.com/apis/console
  var CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  var CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  var REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL;
  var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
  var contactsEndpoint = 'https://www.google.com/m8/feeds/contacts/default/full?updated-min=2007-03-16T00:00:00?alt=json&oauth_token=';

  module.exports = {

    /**
     * Get URL for Oauth.
     *
     * @param {String} email
     *
     * @return {Object}
     */

    getUrl: function getUrl(email) {
      return oauth2Client.generateAuthUrl({
        access_type: 'offline', // will return a refresh token
        approval_prompt: 'force', // get the refresh token.
        scope: 'https://www.googleapis.com/auth/contacts.readonly',
        state: email
      });
    },

    /**
     * Set credentials to Google client from access code.
     *
     */

    setCredentialsFromCode: function setCredentialsFromCode(code, fn) {
      oauth2Client.getToken(code, fn);
    },

    /**
     * Refresh access token.
     *
     * @param {object} tokens
     *   @property {string} access_token
     *   @property {string} refresh_token
     * @param {Function} fn
     */

    refreshAccessToken: function refreshAccessToken(tokens, fn) {
      oauth2Client.setCredentials(tokens);
      oauth2Client.refreshAccessToken(fn);
    },

    /**
     * Get contacts from Google account.
     *
     * @param {String} token
     * @param {Function} fn
     *
     */

    getContacts: function getContacts(token, fn) {
      agent
        .get(contactsEndpoint + token)
        .end(fn);
    }
  };
}());