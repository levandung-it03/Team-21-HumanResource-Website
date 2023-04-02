const express = require('express');
const route = express.Router();
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const cloudUpload = require('../../uploads/cloudinary.config');
const renderMethods = require('./users.render');
const usersController = require('./users.controller');
const authMiddlewares = require('../auth/auth.middlewares');

// route.get('/register', renderMethods.register);
// route.post('/api/users/register', usersController.register);

/**
 * @EQUAL_RIGHT_ACTIONS
 */
route.get('/home/:id', authMiddlewares.verifyToken, renderMethods.home);
route.get('/home', renderMethods.singleHome);
route.get('/login', authMiddlewares.checkingLogedIn, renderMethods.login);
route.get('/password', renderMethods.password);

route.post('/api/users/login', usersController.login);
route.post('/api/users/password', usersController.password);
/**---------------------------------------------------------------------------------------------- */

/**
 * @ADMIN_RIGHT_ACTIONS
 */
route.get('/add-employee', authMiddlewares.verifyToken, authMiddlewares.verifyAdmin, renderMethods.addEmployee);

route.post('/api/users/add-employee', authMiddlewares.verifyToken, cloudUpload.single('avatar'), usersController.addEmployee);
/**---------------------------------------------------------------------------------------------- */

module.exports = route;