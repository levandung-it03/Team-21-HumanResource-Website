const axios = require('axios');
const authMethods = require('../auth/auth.methods');
require('dotenv').config();
const DOMAIN = process.env.DOMAIN;

const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const client = new MongoClient(process.env.MONGO_URI);
const userDBs = client.db('company').collection('userdbs');
const salaryDBs = client.db('company').collection('salary');
const positionDBs = client.db('company').collection('position');
const departmentDBs = client.db('company').collection('department');
const employee_typeDBs = client.db('company').collection('employee_type');

async function getAllSalary() {
    const allSalary = salaryDBs.find({});
    return await allSalary.toArray();
}

async function getAllDepartment() {
    const allDepartment = departmentDBs.find({});
    return await allDepartment.toArray();
}

async function getAllEmployeeType() {
    const allEmployeeType = employee_typeDBs.find({});
    return await allEmployeeType.toArray();
}

async function getAllPosition() {
    const allUser = positionDBs.find({});
    return await allUser.toArray();
}

async function getAllUser() {
    const allUser = userDBs.find({});
    return await allUser.toArray();
}

async function getSpecifiedUser(id) {
    const user = await userDBs.findOne({ _id: new ObjectId(id) });
    return user;
}

async function getCurrentUser(req) {
    const cookiesList = authMethods.handleCookie(req.headers.cookie);
    const user = await getSpecifiedUser(cookiesList.id);

    return user;
}

class renderMethods {
    login(req, res) {
        res.render('login', { layout: './login' });
    }
    password(req, res) {
        res.render('password', { layout: './password' });
    }
    async home(req, res) {
        try {
            const user = await getCurrentUser(req);
            if (user.admin == 0) {
                res.render('home', {
                    user: user,
                    layout: './layouts/employee'
                });
            } else if (user.admin == 1) {
                res.render('home', {
                    user: user,
                    layout: './layouts/admin'
                });
            }
        } catch (err) {
            res.redirect('/login');
        }
    }
    async admin_general(req, res) {
        try {
            const allUsers = await getAllUser();
            const user = await getCurrentUser(req);
            res.render('admin_general', {
                user: user,
                employeeList: allUsers,
                layout: './layouts/admin'
            });
        } catch (err) {
            res.redirect('/login');
        }
    }
    async admin_employeeList(req, res) {
        try {
            const allUsers = await getAllUser();
            const user = await getCurrentUser(req);
            res.render('admin_employee_employee-list', {
                user: user,
                employeeList: allUsers,
                layout: './layouts/admin'
            });
        } catch (err) {
            res.redirect('/login');
        }
    }
    async admin_employeeView(req, res) {
        try {
            const specifiedUser = await getSpecifiedUser(req.params.id);
            const user = await getCurrentUser(req);
            res.render('admin_employee_view', {
                user: user,
                specifiedUser: specifiedUser,
                layout: './layouts/admin'
            });
        } catch (err) {
            res.redirect('/login');
        }
    }
    async admin_addEmployee(req, res) {
        try {
            const user = await getCurrentUser(req);
            const positionList = await getAllPosition();
            const departmentList = await getAllDepartment();
            const employeeTypeList = await getAllEmployeeType();
            res.render('admin_employee_add-employee', {
                user: user,
                positionList: positionList,
                departmentList: departmentList,
                employeeTypeList: employeeTypeList,
                layout: './layouts/admin'
            });
        } catch (err) {
            res.redirect('/login');
        }
    }
    async admin_updateEmployee(req, res) {
        try {
            const specifiedUser = await getSpecifiedUser(req.params.id);
            const positionList = await getAllPosition();
            const departmentList = await getAllDepartment();
            const user = await getCurrentUser(req);
            res.render('admin_employee_update-employee', {
                user: user,
                specifiedUser: specifiedUser,
                departmentList: departmentList,
                positionList: positionList,
                layout: './layouts/admin'
            });
        } catch (err) {
            res.redirect('/login');
        }
    }
    async admin_accountList(req, res) {
        try {
            const allUsers = await getAllUser();
            const user = await getCurrentUser(req);
            res.render('admin_employee_account-list', {
                user: user,
                employeeList: allUsers,
                layout: './layouts/admin'
            });
        } catch (err) {
            res.redirect('/login');
        }
    }
    async admin_employeeTypeList(req, res) {
        try {
            const employeeTypeList = await getAllEmployeeType();
            const user = await getCurrentUser(req);
            res.render('admin_employee_employee-type-list', {
                user: user,
                employeeTypeList: employeeTypeList,
                layout: './layouts/admin'
            });
        } catch (err) {
            res.redirect('/login');
        }
    }
    async admin_addEmployeeType(req, res) {
        try {
            const user = await getCurrentUser(req);
            res.render('admin_employee_add-employee-type', {
                user: user,
                layout: './layouts/admin'
            });
        } catch (err) {
            res.redirect('/login');
        }
    }
    async admin_positionList(req, res) {
        try {
            const positionList = await getAllPosition();
            const user = await getCurrentUser(req);
            res.render('admin_employee_position-list', {
                user: user,
                positionList: positionList,
                layout: './layouts/admin'
            });
        } catch (err) {
            res.redirect('/login');
        }
    }
    async admin_addPosition(req, res) {
        try {
            const user = await getCurrentUser(req);
            res.render('admin_employee_add-position', {
                user: user,
                layout: './layouts/admin'
            });
        } catch (err) {
            res.redirect('/login');
        }
    }
    async admin_departmentList(req, res) {
        try {
            const departmentList = await getAllDepartment();
            const user = await getCurrentUser(req);
            res.render('admin_employee_department-list', {
                user: user,
                departmentList: departmentList,
                layout: './layouts/admin'
            });
        } catch (err) {
            res.redirect('/login');
        }
    }
    async admin_addDepartment(req, res) {
        try {
            const user = await getCurrentUser(req);
            res.render('admin_employee_add-department', {
                user: user,
                layout: './layouts/admin'
            });
        } catch (err) {
            res.redirect('/login');
        }
    }
    async admin_salaryList (req, res) {
        try {
            const salaryInfoList = await getAllSalary();
            const user = await getCurrentUser(req);
            res.render('admin_salary_salary-list', {
                user: user,
                salaryInfoList: salaryInfoList,
                layout: './layouts/admin'
            });
        } catch (err) {
            res.redirect('/login');
        }
    }
    async admin_addSalary (req, res) {
        try {
            const user = await getCurrentUser(req);
            const allUsers = await getAllUser();
            const salaryList = await getAllSalary();
            const positionList = await getAllPosition();
            const departmentList = await getAllDepartment();
            res.render('admin_salary_add-salary', {
                user: user,
                allUsers: allUsers,
                salaryList: salaryList,
                positionList: positionList,
                departmentList: departmentList,
                layout: './layouts/admin'
            });
        } catch (err) {
            res.redirect('/login');
        }
    }
}

module.exports = new renderMethods;