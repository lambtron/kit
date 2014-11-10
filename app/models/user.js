'use strict';

(function () {

  var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

  var UserSchema = new Schema({
      id: ObjectId,
      email: String, // primary key
      contacts: Array, // array of objects
      google_access_token: String,
      google_refresh_token: String,
      google_expiry: Date
  });

  var User = mongoose.model("User", UserSchema);

  module.exports = {
    /**
     * Returns self.
     *
     */
    create: User,


    /**
     * Upsert user with new tokens
     *
     */
    upsertUserToken: function (email, google_refresh_token, google_access_token, google_expiry) {
      var error = function(err) {
        if (err)
          throw err;
      };

      User.update( {email: email}, {
        $set: {
          google_refresh_token: google_refresh_token,
          google_access_token: google_access_token,
          google_expiry: google_expiry
        }
      },
      {upsert: true},
      error);
    },


    /**
     * Upsert user with new contacts
     *
     * @param {string} email
     * @param {array} contacts
     *
     */
    upsertUserContacts: function(email, contacts) {
      var error = function(err) {
        if (err)
          throw err;
      };

      User.update( {email: email}, {
        $set: {
          contacts: contacts
        }
      },
      {upsert: true},
      error);
    }
  };
}());