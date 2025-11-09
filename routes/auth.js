// Reference for code: https://www.npmjs.com/package/passport-google-oauth20

const router = require('express').Router();
const passport = require('passport');

// Using session cookie instead of JWT
// const jwt = require('jsonwebtoken');
// const JWT_SECRET = process.env.JWT_SECRET;

// /auth/google
// In server.js, "require('./config/passport-setup');" sets up the framework, but does not listen for user interaction.
// "router.get('/google" is used to listen for user interaction.
router.get('/google',
    // passport.authenticate('google' tells Passport to use Google Strategy in passport-setup.js
    // It executes the strategy named google.
    passport.authenticate('google', {
     scope: ['profile', 'email'],
     prompt: 'select_account' // This is used so that after logout, I have to login.
    })
);

// auth/google/callback
router.get('/google/callback', 
    passport.authenticate('google', {
        // Authentication failure: not logged in
        failureRedirect: '/login'
        // session: false if using JWT instead of session cookie
        // session: false
    }),
    function(req, res) {
        // Successful authentication, redirect home.
        // This goes to the root of the current domain.
        res.redirect('/');
    }
);

// isProduction is undefined which sets isProduction to false when localhost and production when Render site is used.
const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions =  {
    path: '/',
    httpOnly: true,
    secure: isProduction, // Cookies can only be sent over https when 'secure: true'.
    sameSite: isProduction ? 'none' : 'lax' // 'sameSite: none' required for cross-site OAuth redirects. 'sameSite: lax' is so localhost will work.
};

// Reference for code: https://www.passportjs.org/concepts/authentication/logout/
// /auth/logout terminates login session
router.post('/logout', function(req, res, next){
    req.session.destroy(err => {
        if (err) {
            console.error('An error ocurred! Session cookie was not destroyed.', err);
        }

        res.clearCookie('connect.sid', cookieOptions);
        res.redirect('/');
    });
});

module.exports = router;