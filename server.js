// Resources for node and express tutorial:
// https://www.youtube.com/watch?v=K00J87SofEc
// https://codeforgeek.com/express-nodejs-tutorial/

// Reference for one way to set up mongoose:
// https://medium.com/@finnkumar6/how-to-connect-mongodb-using-mongoose-in-node-js-like-a-pro-a-fresh-and-modern-approach-6470c69aec16

// require('dotenv') loads the dotenv package
// .config() takes the key value pairs in the .env file and loads them into the variable process.env
require('dotenv').config();

// express web server
// express is used to define routes and handle http requests
const express = require('express');

// Using session cookie instead of JWT
// Mongoose is needed for the session store.
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Using session cookie instead of JWT
// This package handles creating, managing, and expiring sessions for users by setting a session Id cookie in the browser and is used by Passport.
const session = require('express-session');

// Using session cookie instead of JWT
// Reference for connect-mongo: https://www.npmjs.com/package/connect-mongo
// This package tells express-session to use the MongoDB database to save the session information so that the session data is stored on the server.
const MongoStore = require('connect-mongo');

const passport = require('passport');

// Using session cookie instead of JWT
// Reference for JWT: https://www.npmjs.com/package/jsonwebtoken
// const jwt = require('jsonwebtoken');

// if (jwt) {
//   console.log('JWT package loaded successfully!');
// } else {
//   console.error('JWT package failed to load!');
// }

// JWT_SECRET is defined here and to ensure it loaded from the .env file.
// const JWT_SECRET = process.env.JWT_SECRET;

// if (JWT_SECRET) {
//   console.log('JWT_SECRET loaded successfully!');
// } else {
//   console.error('JWT_SECRET failed to load!');
// }

// This excutes every line of code in config/passport-setup.js.
 require('./config/passport-setup');

// CORS 
const cors = require('cors');

const corsOptions = {
  origin: ['http://localhost:3000', 'https://lds-sheet-music.onrender.com'],
  methods: ['GET, POST, PUT, DELETE'],
  credentials: true
}

// app is express variable 
const app = express();

// process.env.PORT retreives .env PORT variable if local, but when application is deployed
// process.env.PORT retreives PORT variable from host such as Render.
// 8000 is used when there is no .env PORT variable
const PORT = process.env.PORT || 3000;
const connectMongodb = require('./db/connect');

// Using session cookie instead of JWT
// isProduction is undefined which sets isProduction to false when localhost and production when Render site is used.
const isProduction = process.env.NODE_ENV === 'production';

// process.env.MONGODB_URI retreives .env MONGODB_URI variable if local, but when application is deployed
// process.env.MONGODB_URI retreives MONGODB_URI variable from host such as Render.
const MONGODB_URI = process.env.MONGODB_URI;

// Using session cookie instead of JWT
// Reference for express-session: https://expressjs.com/en/resources/middleware/session.html
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false, // Prevents session from being resaved again to the store if on every request the session has not been modified
  saveUninitialized: false, // Prevents session form be saved when it is new but the session has not been modified
  // Reference for connect-mongo: https://www.npmjs.com/package/connect-mongo
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    // mongooseConnection: mongoose.connection, // This instructs the session store to use the existing Mongoose connection.
    collectionName: 'sessions',
    ttl: 1 * 24 * 60 * 60 // ttl (time to live) - expires in 1 day = 86,400 seconds = 24 hours * 60 minutes / 1 hour * 60 seconds / 1 minutes
  }),
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000, // This is one day in milliseconds: maxAge is in milliseconds.
    secure: isProduction, // Cookies can only be sent over https when 'secure: true'.
    sameSite: isProduction ? 'none' : 'lax' // 'sameSite: none' required for cross-site OAuth redirects. 'sameSite: lax' is so localhost will work.
  }
}))

// Reference for Passport Initialization: https://www.npmjs.com/package/passport
app.use(passport.initialize());

// Using session cookie instead of JWT
app.use(passport.session());

app
  // This checks if an incoming http request is json. If it is, then it
  // parses the json string into a usuable javascript json object and attaches it to
  // the request body in req.body. If it is not json, then the req.body will
  // be undefined or an empty object {}. 
  .use(express.json())
  .use(cors(corsOptions))
  .use('/', require('./routes'));

// References for process.on code: 
// https://www.youtube.com/watch?v=S0przpEKKGU
// https://nodejs.org/api/process.html
// This is used for unexpected API validation errors and to prevent the application from crashing.
// It logs the error and the origin.
// 'stderr' stands for standard error.
// 'fd' stands for file descriptor. 
// process.on('unhandledRejection', (err, origin) => {
//   console.log(process.stderr.fd, `Caught exception: ${err}\n` + `Exception origin: ${origin}`);
// });  

// When a client makes a specific request in a web browser to the root path '/',
// then execute this function. The 'get' in this case checks if the API is running.
// The request object 'req' contains all of the info from the http request from the client.
// The request object 'req' could contain json data (req.body), url parameters (req.params),
// and query strings (req.query).
// The response object 'res' is used to send a http response back to the client such as
// res.send() which sends a simple message, res.json() which sends a json response, and
// res.status() which sends the http status code such as 200.  
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Another way of writing this is this: async function startServer() {
const startServer = async () => {
  if (!MONGODB_URI) {
    console.log('MONGODB_URI is missing from the .env file or the environment production variable.');

    // This makes it so that it stops the node application so it doesn't crash.
    process.exit(1);
  }

  // The await is used to pause here until connectMongodb is done.
  // connectMongodb(MONGODB_URI) passes the variable MONGODB_URI to the function in './db/connect'
  await connectMongodb(MONGODB_URI);

  app.listen(PORT, () => {
    console.log(`First log into Google login route here: http://localhost:${PORT}/auth/google`);
    console.log(`Web Server is listening at port ${PORT}.`);
    console.log(`Access api-docs at http://localhost:${PORT}`);
    console.log(`Access customers at http://localhost:${PORT}/customers`);
  });
}; 

startServer();