const routes = require('express').Router();

const ordersController = require('../controllers/orders');

const checkAuth = require('../middleware/checkAuth');

routes.get('/', checkAuth, ordersController.getOrders);
routes.get('/:id', checkAuth, ordersController.getOrderById);

routes.post('/', checkAuth, ordersController.createOrder);

// The id without the colon is static text in this: /id
// The id with the colon is a dynamic variable in this: /:id
routes.put('/:id', checkAuth, ordersController.updateOrderById);

routes.delete('/:id', checkAuth, ordersController.deleteOrderById);

module.exports = routes;