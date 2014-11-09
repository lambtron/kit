'use strict';

(function () {
  var google = require('googleapis');
  var OAuth2Client = google.auth.OAuth2;
  var agent = require('superagent');

  // Client ID and client secret are available at
  // https://code.google.com/apis/console
  var CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  var CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  var REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL;

  var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

  var contactsEndpoint = 'https://www.google.com/m8/feeds/contacts/default/full?alt=json&oauth_token=';

  module.exports = {
    getUrl: function getUrl(email) {
      return oauth2Client.generateAuthUrl({
        access_type: 'offline', // will return a refresh token
        approval_prompt: 'force', // get the refresh token.
        scope: 'https://www.googleapis.com/auth/contacts.readonly',
        state: email
      });
    },

    setCredentialsFromCode: function setCredentialsFromCode(code, fn) {
      oauth2Client.getToken(code, function(err, tokens) {
        console.log(tokens);
        if (!err) {
          oauth2Client.setCredentials(tokens);
          fn(null, tokens);
        }
      });
    },

    refreshAccessToken: function refreshAccessToken(tokens, fn) {
      // tokens:
      //  .access_token
      //  .refresh_token

      // First set tokens.
      oauth2Client.setCredentials(tokens);
      // Then see if they need to be refreshed.
      oauth2Client.refreshAccessToken(function(err, tokens) {
        if (!err) {
          fn(null, tokens);   // these are the new tokens.
        } else {
          fn(err, null);    // error.
        };
      });
    },

    getContacts: function getContacts(token, fn) {
      // access token: ya29.uQBOWw-iB2JT2zPlJuOZv9dKjrew1bQybEO8N7GsgYz6US2FKuvkFkWnLryqP8JnekS7_OyIUVI3ag
      agent
        .get(contactsEndpoint + token)
        .end(fn); // fn(data)
    }
  };
}());