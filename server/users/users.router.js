const express = require('express');
const route = express.Router();
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
route.get('/admin/general',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_general);

route.get('/admin/category/employee/add-employee',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_addEmployee);

route.get('/admin/category/employee/employee-list',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_employeeList);

route.get('/admin/category/employee/account-list',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_accountList);

route.get('/admin/category/employee/employee-type-list',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_employeeTypeList);

route.get('/admin/category/employee/add-employee-type',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_addEmployeeType);

route.get('/admin/category/employee/update-employee-type/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_updateEmployeeType);

route.get('/admin/category/employee/employee-list/view/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_employeeView);

route.get('/admin/category/employee/employee-list/update/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_addEmployee);

route.get('/admin/category/employee/degree-list',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_degreeList);

route.get('/admin/category/employee/add-degree',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_addDegree);

route.get('/admin/category/employee/update-degree/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_updateDegree);

route.get('/admin/category/employee/technique-list',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_techniqueList);

route.get('/admin/category/employee/add-technique',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_addTechnique);

route.get('/admin/category/employee/update-technique/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_updateTechnique);

route.get('/admin/category/employee/position-list',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_positionList);

route.get('/admin/category/employee/add-position',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_addPosition);

route.get('/admin/category/employee/update-position/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_updatePosition);

route.get('/admin/category/employee/department-list',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_departmentList);

route.get('/admin/category/employee/add-department',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_addDepartment);

route.get('/admin/category/employee/update-department/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_updateDepartment);

route.get('/admin/category/salary/salary-list',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_salaryList);
    
route.get('/admin/category/salary/view-salary/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_viewSalary);

route.get('/admin/category/salary/add-salary/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_addSalary);

route.get('/admin/category/salary/add-salary',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_addSalary);

route.get('/admin/category/bussiness/bussiness-list',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_bussinessList);

route.get('/admin/category/bussiness/add-bussiness',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_addBussiness);

route.get('/admin/category/bussiness/update-bussiness/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_updateBussiness);

route.get('/admin/category/group/group-list',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_groupList);

route.get('/admin/category/group/add-group',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_addGroup);

route.get('/admin/category/group/view-group/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_viewGroup);

route.get('/admin/category/group/add-employee-into-group/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_addEmployeeIntoGroup);

route.get('/admin/category/group/update-group/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_updateGroup);

route.get('/admin/category/compliment/compliment-type',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_complimentType);

route.get('/admin/category/compliment/add-compliment-type',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_addComplimentType);

route.get('/admin/category/compliment/update-compliment-type/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_updateComplimentType);

route.get('/admin/category/compliment/employee-compliments-list',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_employeeComplimentsList);

route.get('/admin/category/compliment/add-employee-compliment',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_addEmployeeCompliment);

route.get('/admin/category/compliment/view-employee-compliments/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_viewEmployeeCompliments);

route.get('/admin/category/compliment/add-employee-compliment/:employeeId',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_addEmployeeCompliment);

route.get('/admin/category/compliment/update-employee-compliment/:employeeId/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_updateEmployeeCompliment);

route.get('/admin/category/compliment/group-compliments-list',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_groupComplimentsList);

route.get('/admin/category/compliment/add-group-compliment',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_addGroupCompliment);

route.get('/admin/category/compliment/view-group-compliments/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_viewGroupCompliments);

route.get('/admin/category/compliment/view-group-compliments/view-group/:idInComplimentDBs/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_viewSpecifiedGroupOfComplimentsList);

route.get('/admin/category/compliment/add-group-compliment/:groupId',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_addGroupCompliment);

route.get('/admin/category/compliment/update-group-compliment/:groupId/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_updateGroupCompliment);

route.get('/admin/category/discipline/discipline-type',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_disciplineType);

route.get('/admin/category/discipline/add-discipline-type',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_addDisciplineType);

route.get('/admin/category/discipline/update-discipline-type/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_updateDisciplineType);

route.get('/admin/category/discipline/employee-discipline-list',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_employeeDisciplineList);

route.get('/admin/category/discipline/add-employee-discipline',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_addEmployeeDiscipline);

route.get('/admin/category/discipline/view-employee-discipline/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_viewEmployeeDiscipline);

route.get('/admin/category/discipline/add-employee-discipline/:employeeId',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_addEmployeeDiscipline);

route.get('/admin/category/discipline/update-employee-discipline/:employeeId/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_updateEmployeeDiscipline);

route.get('/admin/category/discipline/group-discipline-list',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_groupDisciplineList);

route.get('/admin/category/discipline/add-group-discipline',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_addGroupDiscipline);

route.get('/admin/category/discipline/view-group-discipline/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_viewGroupDiscipline);

route.get('/admin/category/discipline/view-group-discipline/view-group/:idInDisciplineDBs/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_viewSpecifiedGroupOfDisciplineList);

route.get('/admin/category/discipline/add-group-discipline/:groupId',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_addGroupDiscipline);

route.get('/admin/category/discipline/update-group-discipline/:groupId/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    renderMethods.admin_updateGroupDiscipline);
    
/** @________________________________________WORKING______________________________________________ */
/** @_____________________________________________________________________________________________ */
/** @POST_METHODS__________________________ */
route.post('/api/admin/add-employee',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    cloudUpload.single('avatar'),
    usersController.addEmployee);

route.post('/api/admin/update-employee/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    cloudUpload.single('avatar'),
    usersController.updateEmployee);

route.post('/api/admin/add-employee-type',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.addEmployeeType);

route.post('/api/admin/update-employee-type/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.updateEmployeeType);

route.post('/api/admin/add-degree',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.addDegree);

route.post('/api/admin/update-degree/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.updateDegree);

route.post('/api/admin/add-technique',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.addTechnique);

route.post('/api/admin/update-technique/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.updateTechnique);

route.post('/api/admin/add-position',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.addPosition);

route.post('/api/admin/update-position/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.updatePosition);

route.post('/api/admin/add-department',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.addDepartment);

route.post('/api/admin/update-department/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.updateDepartment);

route.post('/api/admin/add-salary/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.addSalary);

route.post('/api/admin/add-salary',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.addSalary);

route.post('/api/admin/add-bussiness',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.addBussiness);

route.post('/api/admin/update-bussiness/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.updateBussiness);

route.post('/api/admin/add-group',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.addGroup);

route.post('/api/admin/add-employee-into-group/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.addEmployeeIntoGroup);

route.post('/api/admin/update-group/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.updateGroup);

route.post('/api/admin/add-compliment-type',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.addComplimentType);

route.post('/api/admin/update-compliment-type/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.updateComplimentType);

route.post('/api/admin/add-employee-compliment/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.addEmployeeCompliment);

route.post('/api/admin/add-employee-compliment',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.addEmployeeCompliment);

route.post('/api/admin/update-employee-compliment/:complimentCode',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.updateEmployeeCompliment);

route.post('/api/admin/add-group-compliment/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.addGroupCompliment);

route.post('/api/admin/add-group-compliment',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.addGroupCompliment);

route.post('/api/admin/update-group-compliment/:complimentCode',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.updateGroupCompliment);

route.post('/api/admin/add-discipline-type',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.addDisciplineType);

route.post('/api/admin/update-discipline-type/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.updateDisciplineType);

route.post('/api/admin/add-employee-discipline/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.addEmployeeDiscipline);

route.post('/api/admin/add-employee-discipline',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.addEmployeeDiscipline);

route.post('/api/admin/update-employee-discipline/:disciplineCode',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.updateEmployeeDiscipline);

route.post('/api/admin/add-group-discipline/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.addGroupDiscipline);

route.post('/api/admin/add-group-discipline',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.addGroupDiscipline);

route.post('/api/admin/update-group-discipline/:disciplineCode',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.updateGroupDiscipline);

/** @DELETE_METHODS__________________________ */
route.delete('/api/admin/delete-employee/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.deleteEmployee);

route.delete('/api/admin/delete-position/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.deletePosition);

route.delete('/api/admin/delete-department/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.deleteDepartment);

route.delete('/api/admin/delete-salary/:employeeId/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.deleteSalaryOfEmployee);

route.delete('/api/admin/delete-salary/:id',
        authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
        authMiddlewares.verifyAdmin,
    usersController.deleteSalary);


route.delete('/api/admin/delete-employee-type/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.deleteEmployeeType);

route.delete('/api/admin/delete-degree/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.deleteDegree);

route.delete('/api/admin/delete-technique/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.deleteTechnique);

route.delete('/api/admin/delete-bussiness/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.deleteBussiness);

route.delete('/api/admin/delete-group/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.deleteGroup);

route.delete('/api/admin/delete-employee-inside-group/:group_id/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.deleteEmployeeIntoGroup);

route.delete('/api/admin/delete-compliment-type/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.deleteComplimentType);

route.delete('/api/admin/delete-employee-compliment/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.deleteEmployeeCompliment);

route.delete('/api/admin/delete-compliment-of-employee/:employeeId/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.deleteComplimentOfEmployee);

route.delete('/api/admin/delete-group-compliment/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.deleteGroupCompliment);

route.delete('/api/admin/delete-compliment-of-group/:groupId/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.deleteComplimentOfGroup);

route.delete('/api/admin/delete-discipline-type/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.deleteDisciplineType);

route.delete('/api/admin/delete-employee-discipline/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.deleteEmployeeDiscipline);

route.delete('/api/admin/delete-discipline-of-employee/:employeeId/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.deleteDisciplineOfEmployee);

route.delete('/api/admin/delete-group-discipline/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.deleteGroupDiscipline);

route.delete('/api/admin/delete-discipline-of-group/:groupId/:id',
    authMiddlewares.verifyTokenAndGenerateAccessTokenIfExpiring,
    authMiddlewares.verifyAdmin,
    usersController.deleteDisciplineOfGroup);

/**@_______________________________________________________________________________________________ */

module.exports = route;