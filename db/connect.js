// require loads the mongoose package from the node_modules folder and
// loads the functionality into the variable mongoose 
const mongoose = require('mongoose');

const connectDB = async (uri) => {
  try {
    // .connect is a function in the mongoose library 
    await mongoose.connect(uri);

    console.log('MongoDB connected sucessfully!')

  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    // Exit node of the connection fails.
    process.exit(1);
  }
};


// The function connectDB is exported into the variable connectMongodb in server.js
// with this line of code: const connectMongodb = require('./db/connect');.
module.exports = connectDB;
