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
route.get('/home',
    authMiddlewares.verifyToken,
    renderMethods.home);
route.get('/login',
    authMiddlewares.checkingLogedIn,
    renderMethods.login);
route.get('/password', renderMethods.password);

route.post('/api/users/login', usersController.login);
route.post('/api/users/password', usersController.password);
/**---------------------------------------------------------------------------------------------- */

/**
 * @ADMIN_RIGHT_ACTIONS
 */
route.get('/admin/category/general',
    authMiddlewares.verifyToken,
    renderMethods.admin_general);

route.get('/admin/category/employee/add-employee',
    authMiddlewares.verifyToken,
    renderMethods.admin_addEmployee);

route.get('/admin/category/employee/employee-list',
    authMiddlewares.verifyToken,
    renderMethods.admin_employeeList);
    
route.get('/admin/category/employee/account-list',
    authMiddlewares.verifyToken,
    renderMethods.admin_accountList);

route.get('/admin/category/employee/employee-list/view/:id',
    authMiddlewares.verifyToken,
    renderMethods.admin_employeeView);

route.get('/admin/category/employee/employee-list/update/:id',
    authMiddlewares.verifyToken,
    renderMethods.admin_updateEmployee);
    
route.get('/admin/category/employee/position-list',
    authMiddlewares.verifyToken,
    renderMethods.admin_positionList);

route.get('/admin/category/employee/add-position',
    authMiddlewares.verifyToken,
    renderMethods.admin_addPosition);

route.get('/admin/category/employee/department-list',
    authMiddlewares.verifyToken,
    renderMethods.admin_departmentList);

route.get('/admin/category/employee/add-department',
    authMiddlewares.verifyToken,
    renderMethods.admin_addDepartment);

route.post('/api/admin/add-employee',
    authMiddlewares.verifyToken,
    cloudUpload.single('avatar'),
    usersController.addEmployee);

route.post('/api/admin/update-employee/:id',
    authMiddlewares.verifyToken,
    cloudUpload.single('avatar'),
    usersController.updateEmployee);

route.post('/api/admin/add-position',
    authMiddlewares.verifyToken,
    usersController.addPosition);

route.post('/api/admin/add-department',
    authMiddlewares.verifyToken,
    usersController.addDepartment);

route.delete('/api/admin/delete-employee/:id',
    authMiddlewares.verifyToken,
    usersController.deleteEmployee);

route.delete('/api/admin/delete-position/:id',
    authMiddlewares.verifyToken,
    usersController.deletePosition);

route.delete('/api/admin/delete-department/:id',
    authMiddlewares.verifyToken,
    usersController.deleteDepartment);
/**---------------------------------------------------------------------------------------------- */

module.exports = route;