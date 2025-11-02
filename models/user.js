// require loads the mongoose package from the node_modules folder and
// loads the functionality into the variable mongoose
const mongoose = require('mongoose');

// moongoose.Schema obtains the function Schema from the mongoose library and
// assigns it to the local variable Schema
const Schema = mongoose.Schema;

const userSchema = new Schema({
    googleId: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        trim: true,
        required: true
    },
    thumbnail: {
        type: String,
        trim: true,
        // Default thumbnail image can be created from here: https://placehold.co/
        default: 'https://placehold.co/100x100?text=P'
    }    
});

// mongoose.model('User', userSchema) creates a mongoose model object called 'User'
// so that mongoose functions like .find() and .create() can function properly within 
// the controller file
module.exports = mongoose.model('User', userSchema);