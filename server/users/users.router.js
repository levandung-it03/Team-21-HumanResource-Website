const express = require('express');
const route = express.Router();
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const renderMethods = require('./users.render');
const usersController = require('./users.controller');
const authController = require('../auth/auth.controller');

route.get('/register', renderMethods.register);
route.get('/login', authController.checkingLogedIn, renderMethods.login);
route.get('/admin', authController.verifyToken, renderMethods.adminHome);
route.get('/employee', authController.verifyToken, renderMethods.employeeHome);

route.post('/api/users/register', usersController.register);
route.post('/api/users/login', usersController.login);

module.exports = route;