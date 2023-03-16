const express = require('express');
const route = express.Router();

const renderMethods = require('../services/render');
const controller = require('../controller/controller');

route.get('/register', renderMethods.register);
route.get('/login', renderMethods.login);

route.post('/api/users/add-user', controller.register);
route.post('/api/users/login', controller.login);

module.exports = route;