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
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    renderMethods.home);
route.get('/login',
    authMiddlewares.checkingLogedIn,
    renderMethods.login);
route.get('/password', renderMethods.password);

route.post('/api/users/login', usersController.login);
route.post('/api/users/password', usersController.password);
/**@_______________________________________________________________________________________________ */

/**
 * @ADMIN_RIGHT_ACTIONS____________________________________________________________________________
 */
/** @GET_METHODS__________________________ */
route.get('/admin/category/general',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_general);

route.get('/admin/category/employee/add-employee',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_addEmployee);

route.get('/admin/category/employee/employee-list',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_employeeList);

route.get('/admin/category/employee/account-list',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_accountList);

route.get('/admin/category/employee/employee-type-list',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_employeeTypeList);

route.get('/admin/category/employee/add-employee-type',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_addEmployeeType);

route.get('/admin/category/employee/update-employee-type/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_updateEmployeeType);

route.get('/admin/category/employee/employee-list/view/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_employeeView);

route.get('/admin/category/employee/employee-list/update/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_updateEmployee);

route.get('/admin/category/employee/degree-list',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_degreeList);

route.get('/admin/category/employee/add-degree',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_addDegree);

route.get('/admin/category/employee/update-degree/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_updateDegree);

route.get('/admin/category/employee/position-list',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_positionList);

route.get('/admin/category/employee/add-position',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_addPosition);

route.get('/admin/category/employee/update-position/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_updatePosition);

route.get('/admin/category/employee/department-list',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_departmentList);

route.get('/admin/category/employee/add-department',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_addDepartment);

route.get('/admin/category/employee/update-department/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_updateDepartment);

route.get('/admin/category/salary/salary-list',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_salaryList);

route.get('/admin/category/salary/add-salary',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_addSalary);

/** @POST_METHODS__________________________ */
route.post('/api/admin/add-employee',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    cloudUpload.single('avatar'),
    usersController.addEmployee);

route.post('/api/admin/update-employee/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    cloudUpload.single('avatar'),
    usersController.updateEmployee);

route.post('/api/admin/add-employee-type',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    usersController.addEmployeeType);

route.post('/api/admin/update-employee-type/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    usersController.updateEmployeeType);

route.post('/api/admin/add-degree',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    usersController.addDegree);

route.post('/api/admin/update-degree/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    usersController.updateDegree);

route.post('/api/admin/add-position',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    usersController.addPosition);

route.post('/api/admin/update-position/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    usersController.updatePosition);

route.post('/api/admin/add-department',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    usersController.addDepartment);

route.post('/api/admin/update-department/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    usersController.updateDepartment);

route.post('/api/admin/add-salary',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    usersController.addSalary);

/** @DELETE_METHODS__________________________ */
route.delete('/api/admin/delete-employee/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    usersController.deleteEmployee);

route.delete('/api/admin/delete-position/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    usersController.deletePosition);

route.delete('/api/admin/delete-department/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    usersController.deleteDepartment);

route.delete('/api/admin/delete-salary/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    usersController.deleteSalary);

route.delete('/api/admin/delete-employee-type/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    usersController.deleteEmployeeType);

route.delete('/api/admin/delete-degree/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiration,
    authMiddlewares.verifyAdmin,
    usersController.deleteDegree);
/**@_______________________________________________________________________________________________ */

module.exports = route;