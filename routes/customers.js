const routes = require('express').Router();

const customersController = require('../controllers/customers');

routes.get('/', customersController.getCustomers);
routes.get('/:id', customersController.getCustomerById);

routes.post('/', customersController.createCustomer);

// The id without the colon is static text in this: /id
// The id with the colon is a dynamic variable in this: /:id
routes.put('/:id', customersController.updateCustomerById);

routes.delete('/:id', customersController.deleteCustomerById);

module.exports = routes;