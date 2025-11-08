const routes = require('express').Router();

const customersController = require('../controllers/customers');

const checkAuth = require('../middleware/checkAuth');

routes.get('/', checkAuth, customersController.getCustomers);
routes.get('/:id', checkAuth, customersController.getCustomerById);

routes.post('/', checkAuth, customersController.createCustomer);

// The id without the colon is static text in this: /id
// The id with the colon is a dynamic variable in this: /:id
routes.put('/:id', checkAuth, customersController.updateCustomerById);

routes.delete('/:id', checkAuth, customersController.deleteCustomerById);

module.exports = routes;