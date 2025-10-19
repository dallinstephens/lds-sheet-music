// One reference on how to create a mongoose schema:
// https://medium.com/@finnkumar6/how-to-connect-mongodb-using-mongoose-in-node-js-like-a-pro-a-fresh-and-modern-approach-6470c69aec16

// require loads the mongoose package from the node_modules folder and
// loads the functionality into the variable mongoose
const mongoose = require('mongoose');

// moongoose.Schema obtains the function Schema from the mongoose library and
// assigns it to the local variable Schema
const Schema = mongoose.Schema;

const addressSchema = new Schema({
    street: {
        type: String,
        trim: true // this trims whitespace from start of end of string
    },
    city: {
        type: String,
        trim: true
    },
    state: {
        type: String,
        trim: true,
        uppercase: true,
        maxlength: 2 // Example: UT for Utah
    },
    zip: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        default: 'US'
    }
}, {_id: false});

const customerSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true
    },
    billingAddress: addressSchema,
    shippingAddress: addressSchema,
    phone: {
        type: String,
        trim: true
    }
});

// mongoose.model('Customer', customerSchema) creates a mongoose model object called 'Customer'
// so that mongoose functions like .find() and .create() can function properly within 
// the controller file
module.exports = mongoose.model('Customer', customerSchema);