const routes = require('express').Router();

routes.use('/', require('./swagger'));
routes.use('/customers', require('./customers'));
routes.use('/auth', require('./auth'));

module.exports = routes;
