const routes = require('express').Router();

routes.use('/', require('./swagger'));
routes.use('/customers', require('./customers'));

module.exports = routes;
