// Reference for writing middleware: https://expressjs.com/en/guide/writing-middleware.html
// References for isAuthenticated:
// https://stackoverflow.com/questions/17756848/only-allow-passportjs-authenticated-users-to-visit-protected-page
// https://github.com/jaredhanson/passport/issues/683
// https://github.com/jaredhanson/passport/blob/597e289d6fa27a2c35d16dd411de284123e3817e/lib/http/request.js#L83


const checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next(); // continue to protected route
    } else {
        res.status(401).json({ error: 'Unauthorized: You must first be logged in.'});
    }
}

module.exports = checkAuth;