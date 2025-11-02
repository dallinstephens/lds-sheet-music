// Reference for passport code: https://www.npmjs.com/package/passport
// Refernce for passport-google-oauth20: https://www.npmjs.com/package/passport-google-oauth20

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Customer = require('../models/customer');

// require('dotenv') loads the dotenv package
// .config() takes the key value pairs in the .env file and loads them into the variable process.env
require('dotenv').config();

// 'passport.use(new GoogleStrategy({' is used to define the process of logging in with Google.
// 'new GoogleStrategy' creates a new instance of Google OAuth 2.0 Strategy.
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // http://localhost:3000/auth/google/callback & https://lds-sheet-music.onrender.com/auth/google/callback were
    // set up in https://console.cloud.google.com/auth/clients?project=lds-sheet-music-oauth-api&supportedpurview=project
    // When user clicks "Sign in with Google", the user has not entered an username or password yet.
    // When user clicks "Sign in with Google", it redirects the browser to Google's official login domain at accounts.google.com.
    // When user clicks "Sign in with Google", the express server via passport builds and passes a hidden special url that 
    // contains clientID, scope, and callbackURL to accounts.google.com.
    callbackURL: "/auth/google/callback",
    // The scope requests permissions from Google to obtain the user's Google profile and the user's Google email.
    scope: ['profile', 'email']
  },
  // Verification function:
  // The word 'async' is needed because we are checking if the email is in our database.
  // The word 'done' is used as a callback function created from passport: 'done' is used here, but it could be called 
  // something else like 'cb' for callback function.
  async (profile, done) => {
    const userEmail = profile.emails && profiles.emails.length > 0 ? profile.emails[0].value : null;

    if (!userEmail) {
        return done(new Error('Google did not return an email address!'), null);
    }

    try {
        // The variable 'currentUser' contains the entire customer mongodb record if it exists. Otherwise,
        // 'currentUser' will be null. 'Customer' comes from models/customer and 'findOne' is a Mongoose function
        // that can be used because 'const mongoose = require('mongoose');' is at the top of models/customer.js.
        let currentUser = await Customer.findOne({ email: userEmail});

        if (currentUser) {
            console.log('User found and logged in: ', currentUser.email);
            // 'null' passed into the first argument tells passport that there was no error during the database check.
            // 'currentUser' passed into the second argument tells passport to serialize the currentUser object to
            // create the session cookie. A session cookie is an encrypted token that allows the server to recognize
            // the logged-in user. Upon logout, the server deletes the cookie.
            done(null, currentUser);
        } else {
            console.log('A new user was detected and new record will be created.');

            const newUser = await Customer.create({
                googleId: profile.id,
                firstName: profile.name.givenName || 'Unknown',
                lastName: profile.name.familyName || 'Unknown',
                email: userEmail,
                phone: 'N/A'
            });

            console.log('New customer created: ', newUser.email);
            done(null, newUser);
        }
    } catch (err) {
        console.error('Database error occurred during OAuth callback:', err);
        return done(err, null); // This passes errors back to passport.
    }

    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = passport;