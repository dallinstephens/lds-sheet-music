const routes = require('express').Router();

const lesson1Controller = require('../controllers/lesson1');

routes.get('/', lesson1Controller.corbinRoute);

routes.get('/dallin', lesson1Controller.dallinRoute);

module.exports = routes;
