'use strict';

(function () {
  var google = require('googleapis');
  var OAuth2Client = google.auth.OAuth2;

  // Client ID and client secret are available at
  // https://code.google.com/apis/console
  var CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  var CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  var REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL;

  var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

  module.exports = {
    getUrl: function getUrl(email) {
      return oauth2Client.generateAuthUrl({
        access_type: 'offline', // will return a refresh token
        approval_prompt: 'force', // get the refresh token.
        scope: 'https://www.googleapis.com/auth/calendar.readonly',
        state: email
      });
    },

    setCredentialsFromCode: function setCredentialsFromCode(code, fn) {
      oauth2Client.getToken(code, function(err, tokens) {
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
    }
  };
}());