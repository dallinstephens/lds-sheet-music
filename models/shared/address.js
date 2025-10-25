// require loads the mongoose package from the node_modules folder and
// loads the functionality into the variable mongoose
const mongoose = require('mongoose');

// moongoose.Schema obtains the function Schema from the mongoose library and
// assigns it to the local variable Schema
const Schema = mongoose.Schema;

// addressSchema is used in models/customer.js and models/order.js
const addressSchema = new Schema({
    street: {
        type: String,
        trim: true, // this trims whitespace from start of end of string
        // If the hyphen is not at then end inside [], then it must be '\-' if using a hyphen as a character.
        match: [/^[A-Za-z0-9\s.,#-]+$/, 'Street must contain only letters, numbers, spaces, periods, commas, hyphens, and the pound sign (#).'],
        required: [true, 'Street address is required.']
    },
    city: {
        type: String,
        trim: true,
        match: [/^[A-Za-z\s-]+$/, 'City must contain only letters, spaces, or hyphens.'],
        required: [true, 'City is required.']
    },
    state: {
        type: String,
        trim: true,
        uppercase: true,
        maxlength: 2, // Example: UT for Utah
        match: [/^[A-Z]{2}$/, 'State must be 2 uppercase letters.'],
        required: [true, 'State or province is required.']
    },
    zip: {
        type: String,
        trim: true,
        match: [/^[A-Za-z0-9-]+$/, 'Zip must contain only letters, numbers, and hyphens.'],
        required: [true, 'Zip or postal code is required.']
    },
    country: {
        type: String,
        default: 'US',
        uppercase: true,
        maxlength: 2,
        match: [/^[A-Z]{2}$/, 'Country must be 2 uppercase letters.'],
        required: [true, 'Country is required.']        
    }
}, {_id: false});

// addressSchema is exported so that it can be used by models/customer.js and models/order.js
module.exports = addressSchema;