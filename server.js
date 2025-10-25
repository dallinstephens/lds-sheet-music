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

// CORS 
const cors = require('cors');

// app is express variable 
const app = express();

// process.env.PORT retreives .env PORT variable if local, but when application is deployed
// process.env.PORT retreives PORT variable from host such as Render.
// 8000 is used when there is no .env PORT variable
const PORT = process.env.PORT || 8000;
const connectMongodb = require('./db/connect');

// process.env.MONGODB_URI retreives .env MONGODB_URI variable if local, but when application is deployed
// process.env.MONGODB_URI retreives MONGODB_URI variable from host such as Render.
const MONGODB_URI = process.env.MONGODB_URI;

app
  // This checks if an incoming http request is json. If it is, then it
  // parses the json string into a usuable javascript json object and attaches it to
  // the request body in req.body. If it is not json, then the req.body will
  // be undefined or an empty object {}. 
  .use(express.json())
  .use(cors())
  .use('/', require('./routes'));

// References for process.on code: 
// https://www.youtube.com/watch?v=S0przpEKKGU
// https://nodejs.org/api/process.html
// This is used for unexpected API validation errors and to prevent the application from crashing.
// It logs the error and the origin.
// 'stderr' stands for standard error.
// 'fd' stands for file descriptor. 
process.on('uncaughtException', (err, origin) => {
  console.log(process.stderr.fd, `Caught exception: ${err}\n` + `Exception origin: ${origin}`);
});  

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
    console.log(`Web Server is listening at port ${PORT}.`);
    console.log(`Access api-docs at http://localhost:${PORT}`);
    console.log(`Access customers at http://localhost:${PORT}/customers`);
  });
}; 

startServer();