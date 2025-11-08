// Reference for code: https://www.npmjs.com/package/passport-google-oauth20

const router = require('express').Router();
const passport = require('passport');

// /auth/google
// In server.js, "require('./config/passport-setup');" sets up the framework, but does not listen for user interaction.
// "router.get('/google" is used to listen for user interaction.
router.get('/google',
    // passport.authenticate('google' tells Passport to use Google Strategy in passport-setup.js
    // It executes the strategy named google.
    passport.authenticate('google', {
     scope: ['profile', 'email'] 
    })
);

// auth/google/callback
router.get('/google/callback', 
    passport.authenticate('google', {
        // Authentication failure: not logged in
        failureRedirect: '/login' 
    }),
    function(req, res) {
        // Successful authentication, redirect home.
        // This goes to the root of the current domain.
        res.redirect('/');
    }
);

// Reference for code: https://www.passportjs.org/concepts/authentication/logout/
// /auth/logout terminates login session
router.post('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { 
        return next(err); 
    }
    res.redirect('/');
  });
});

module.exports = router;