const routes = require('express').Router();

const customersController = require('../controllers/customers');

routes.get('/customers/', customersController.getCustomers);
routes.get('/customers/:id', customersController.getCustomerById);

routes.post('/customers', customersController.createCustomer);

// The id without the colon is static text in this: /customers/id
// The id with the colon is a dynamic variable in this: /customers/:id
routes.put('/customers/:id', customersController.updateCustomerById);

routes.delete('/customers/:id', customersController.deleteCustomerById);

module.exports = routes;