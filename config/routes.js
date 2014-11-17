'use strict';

(function() {
  // Import helpers ============================================================
  var Google = require('../app/helpers/google');
  var User = require('../app/models/user');

  // Public functions. =========================================================
  module.exports = function(app) {

    /**
     * Get url for oauth
     *
     */

    app.post('/api/oauth', function(req, res) {
      var email = req.body.email;
      var url = Google.getUrl(email);
      res.send({url: url}, 200);
    });

    /**
     * Save authorized user to database.
     *
     */

    app.post('/api/user', function(req, res) {
      var email = req.body.email || '';
      var code = req.body.code || '';
      if (code.length == 0 || email.length == 0) return;
      Google.setCredentialsFromCode(code, function(err, tokens) {
        if (err) return;
        tokens.refresh_token = tokens.refresh_token || '';
        tokens.access_token = tokens.access_token || '';
        tokens.expiry_date = tokens.expiry_date || '';
        User.upsertUserToken(this, tokens.refresh_token, tokens.access_token,
          tokens.expiry_date);
      }.bind(email));

      res.send({success: true},200);
    });

    /**
     * Retrieve or save a user's contacts.
     *
     */

    app.post('/api/contacts', function(req, res) {
      var email = req.body.email;
      var contacts = req.body.contacts;
      if (!email) return;
      if (contacts) {
        User.upsertUserContacts(email, contacts);
        return;
      }
      User.create.find({email: email}, function(err, users) {
        var user = users[0];
        refreshTokens(user, function(err, data) {
          if (err || !data.access_token) return;
          Google.getContacts(data.access_token, function(err, data) {
            var contacts = data.text;
            res.send(contacts, 200);
          });
        });
      });

      // res.send(200);
    });

    /**
     * Catch-all return index.html
     *
     */

    app.get('/*', function(req, res) {
      res.sendfile('index.html', {'root': './public/views/'});
    });
  };

  /**
   * Refresh Google tokens given user tokens.
   *
   * @param {Object} tokens
   * @param {Function} fn
   *
   */
  function refreshTokens(user, fn) {
    var load = {
      access_token: user.google_access_token,
      refresh_token: user.google_refresh_token
    };
    Google.refreshAccessToken(load, function(err, tokens) {
      User.upsertUserToken(this, tokens.refresh_token,
        tokens.access_token, tokens.expiry_date);
      fn(err, tokens);
    }.bind(user.email));
  }

}());