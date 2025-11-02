// One reference on how to create a mongoose schema:
// https://medium.com/@finnkumar6/how-to-connect-mongodb-using-mongoose-in-node-js-like-a-pro-a-fresh-and-modern-approach-6470c69aec16

// require loads the mongoose package from the node_modules folder and
// loads the functionality into the variable mongoose
const mongoose = require('mongoose');

const addressSchema = require('./shared/address');

// moongoose.Schema obtains the function Schema from the mongoose library and
// assigns it to the local variable Schema
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    googleId: {
        type: String,
        unique: true,
        required: true
    },    
    firstName: {
        type: String,
        trim: true,
        required: true,
        // '/' at the beginning is the delimeter which starts the regular expression pattern.
        // '^' asserts that the match must start at the beginning of the string.
        // '\s' is any whitespace character such as space, tab, or newline.
        // '\-' is for a dash character. The '\' is used to escape so that - is
        // interpreted as a - and not part of something like A-Z for example.
        // However, if the hyphen is placed at the end inside [], then it does not need the 
        // escape character '\' if using a hyphen as a character.
        // '+' means one or more.
        // '$' asserts that the match must end at the ending of the string.
        // '/' at the end is the delimeter which ends the regular expression pattern. 
        match: [/^[A-Za-z\s-]+$/, 'First name must contain only letters, spaces, or hyphens.']        
    },
    lastName: {
        type: String,
        trim: true,
        required: true,
        match: [/^[A-Za-z\s-]+$/, 'Last name must contain only letters, spaces, or hyphens.']
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true,
        // Example: user.name@gmail.com
        // '\w' is any word character A-Z, a-z, 0-9, or underscore _.
        // '+' is one or more.
        // '()' is a group.
        // '[.-]' is a dot or hyphen.
        // '?' is zero or one time.
        // '*' is zero or more times.
        // '\.' is the dot character where '\' is used to escape so that the 
        // dot is interpreted as a dot.
        // '\w{2,3}' is 2 or 3 word characters
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email! Email must be a valid email address.']        
    },
    billingAddress: addressSchema,
    shippingAddress: addressSchema,
    phone: {
        type: String,
        trim: true,
        match: [/^[0-9\s()+-]+$/, 'The phone number must contain only numbers, spaces, parentheses, the plus sign (+), and hyphens (-).']
    }
});

// mongoose.model('Customer', customerSchema) creates a mongoose model object called 'Customer'
// so that mongoose functions like .find() and .create() can function properly within 
// the controller file
module.exports = mongoose.model('Customer', customerSchema);