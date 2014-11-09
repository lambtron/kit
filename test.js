var google = require('googleapis');
var OAuth2Client = google.auth.OAuth2;
var agent = require('superagent');

// Client ID and client secret are available at
// https://code.google.com/apis/console
var CLIENT_ID = '899209328359-cuq0ejvo709i9u42o9lvvr5ov7c6fkrs.apps.googleusercontent.com';
var CLIENT_SECRET = 'EdrNLYP2wFlIfa7X6m1HEDoZ';
var REDIRECT_URL = 'localhost:3000/oauth2callback';

var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

var contactsEndpoint = 'https://www.google.com/m8/feeds/contacts/{userEmail}/full';

