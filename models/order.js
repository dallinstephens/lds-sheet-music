// One reference on how to create a mongoose schema:
// https://medium.com/@finnkumar6/how-to-connect-mongodb-using-mongoose-in-node-js-like-a-pro-a-fresh-and-modern-approach-6470c69aec16

// require loads the mongoose package from the node_modules folder and
// loads the functionality into the variable mongoose
const mongoose = require('mongoose');

const addressSchema = require('./shared/address');

// moongoose.Schema obtains the function Schema from the mongoose library and
// assigns it to the local variable Schema
const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
    sku: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1.']
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price must be non-negative.']
    }
}, {_id: false}); // The second argument is the options object which is '{_id: false})'. 

// This function defines the order schema.
const orderSchema = new Schema({
    // customer_id is used to establish a relationship between customer data and order data
    // The customer_id value is identical to the customer _id value in mongodb.
    // Example:
    // Customer: { "_id": "123abc...", "firstName": "Dallin", ... }
    // Order: { "_id": "456wyz...", customer_id": "123abc...", ... } 
    customer_id: {
        // 'type: Schema.Types.ObjectId' saves _id of the customer to customer_id
        // and makes sure it is a properly formatted mongodb _id
        type: Schema.Types.ObjectId,
        // "ref: 'Customer'" is used so that the _id is saved from the customers collection
        // which is associated with the 'Customer' model which is the name that comes from this
        // line of code in the modles/customer.js file:
        // module.exports = mongoose.model('Customer', orderSchema);
        ref: 'Customer',
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    billingAddress: {
        type: addressSchema,
        required: true
    },
    shippingAddress: addressSchema,
    // Brackets are used because this is an array of items even if it is one item.
    items: {
        type: [orderItemSchema],
        required: [true, 'The order must contain at least 1 item.']
    },
    subtotal: {
        type: Number,
        required: true,
        min: [0, 'Subtotal cannot be negative.']
    },
    shippingPrice: {
        type: Number,
        required: true,
        min: [0, 'Shipping price cannot be negative.']
    },
    totalPrice: {
        type: Number,
        required: true,
        min: [0, 'Total price cannot be negative.']
    },
    orderDate: {
        type: Date,
        default: Date.now
    }
});

// mongoose.model('Order', orderSchema) creates a mongoose model object called 'Order'
// so that mongoose functions like .find() and .create() can function properly within 
// the controller file
module.exports = mongoose.model('Order', orderSchema);