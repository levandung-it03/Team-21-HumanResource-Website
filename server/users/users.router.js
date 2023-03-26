const express = require('express');
const route = express.Router();
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const renderMethods = require('./users.render');
const usersController = require('./users.controller');
const authMiddlewares = require('../auth/auth.middlewares');

route.get('/register', renderMethods.register);
route.get('/login', authMiddlewares.checkingLogedIn, renderMethods.login);
route.get('/password', renderMethods.password);
route.get('/home/admin', authMiddlewares.verifyToken, renderMethods.adminHome);
route.get('/home/employee', authMiddlewares.verifyToken, renderMethods.employeeHome);

route.post('/api/users/register', usersController.register);
route.post('/api/users/login', usersController.login);
route.post('/api/users/password', usersController.password);

module.exports = route;