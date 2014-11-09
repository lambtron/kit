'use strict';

(function() {
  // Import helpers ============================================================
  var Google = require('../app/helpers/google');

  // Public functions. =========================================================
  module.exports = function (app) {
    // API routes. =============================================================
    app.post('/api/oauth', function (req, res) {
      var email = req.body.email;

      // Pass email to Google to retrieve redirect URL with email as state.
      var url = Google.getUrl(email);
      res.send({url: url}, 200);
    });

    // Application routes ======================================================
    app.get('/oauth2callback', function (req, res) {
      // Callback screen.
      var email = req.query.state;
      Google.setCredentialsFromCode(req.query.code, function(err, tokens) {
        // Make sure all parameters exist.
        if (this.length > 0) {
          tokens.refresh_token = tokens.refresh_token || '';
          tokens.access_token = tokens.access_token || '';
          tokens.expiry_date = tokens.expiry_date || '';
          User.upsertUser(this, tokens.refresh_token, tokens.access_token,
            tokens.expiry_date, twilio_number);
        }
      }.bind(email));

      // Success!
      res.sendfile('done.html', {'root': './public/views/'});
    });

    app.post('/conference', function (req, res) {
      var name = req.query.name || '';
      res.set('Content-Type', 'text/xml');
      res.send(Twilio.getConferenceTwiml(name));
    });

    app.get('/*', function (req, res) {
      res.sendfile('index.html', {'root': './public/views/'});
    });
  };
}());