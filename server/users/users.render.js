const axios = require('axios');
const authMethods = require('../auth/auth.methods');
require('dotenv').config();
const DOMAIN = process.env.DOMAIN;

const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const client = new MongoClient(process.env.MONGO_URI);
const userDBs = client.db('company').collection('userdbs');
const salaryDBs = client.db('company').collection('salary');
const degreeDBs = client.db('company').collection('degree');
const positionDBs = client.db('company').collection('position');
const departmentDBs = client.db('company').collection('department');
const employee_typeDBs = client.db('company').collection('employee_type');

function clearCookiesAndReturnLogin(res) {
    res.clearCookie('accessToken')
        .clearCookie('refreshToken')
        .clearCookie('id')
        .clearCookie('admin')
        .redirect('/login');
    return;
}

async function getAllDegree() {
    const allDegree = degreeDBs.find({});
    return await allDegree.toArray();
}

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

async function getSpecifiedObject(id, db) {
    const object = await db.findOne({ _id: new ObjectId(id) });
    return object;
}

async function getCurrentUser(req) {
    const cookiesList = authMethods.handleCookie(req.headers.cookie);
    const user = await getSpecifiedObject(cookiesList.id, userDBs);

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
            clearCookiesAndReturnLogin(res);
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
            clearCookiesAndReturnLogin(res);
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
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_employeeView(req, res) {
        try {
            const specifiedUser = await getSpecifiedObject(req.params.id, userDBs);
            const user = await getCurrentUser(req);
            res.render('admin_employee_view', {
                user: user,
                specifiedUser: specifiedUser,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_addEmployee(req, res) {
        try {
            const user = await getCurrentUser(req);
            const degreeList = await getAllDegree();
            const positionList = await getAllPosition();
            const departmentList = await getAllDepartment();
            const employeeTypeList = await getAllEmployeeType();
            res.render('admin_employee_add-employee', {
                user: user,
                degreeList: degreeList,
                positionList: positionList,
                departmentList: departmentList,
                employeeTypeList: employeeTypeList,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_updateEmployee(req, res) {
        try {
            const specifiedUser = await getSpecifiedObject(req.params.id, userDBs);
            const degreeList = await getAllDegree();
            const positionList = await getAllPosition();
            const departmentList = await getAllDepartment();
            const employeeTypeList = await getAllEmployeeType();
            const user = await getCurrentUser(req);
            res.render('admin_employee_update-employee', {
                user: user,
                degreeList: degreeList,
                specifiedUser: specifiedUser,
                departmentList: departmentList,
                positionList: positionList,
                employeeTypeList: employeeTypeList,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
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
            clearCookiesAndReturnLogin(res);
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
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_addEmployeeType(req, res) {
        try {
            const user = await getCurrentUser(req);
            res.render('admin_employee_add-employee-type', {
                user: user,
                isUpdating: false,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_updateEmployeeType(req, res) {
        try {
            const user = await getCurrentUser(req);
            const specifiedEmployee_type = await getSpecifiedObject(req.params.id, employee_typeDBs);
            res.render('admin_employee_add-employee-type', {
                user: user,
                isUpdating: true,
                specifiedEmployee_type: specifiedEmployee_type,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_degreeList(req, res) {
        try {
            const user = await getCurrentUser(req);
            const degreeList = await getAllDegree();
            res.render('admin_employee_degree-list', {
                user: user,
                degreeList: degreeList,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_addDegree(req, res) {
        try {
            const user = await getCurrentUser(req);
            res.render('admin_employee_add-degree', {
                user: user,
                isUpdating: false,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_updateDegree(req, res) {
        try {
            const user = await getCurrentUser(req);
            const specifiedDegree = await getSpecifiedObject(req.params.id, degreeDBs);
            res.render('admin_employee_add-degree', {
                user: user,
                isUpdating: true,
                specifiedDegree: specifiedDegree,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
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
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_addPosition(req, res) {
        try {
            const user = await getCurrentUser(req);
            res.render('admin_employee_add-position', {
                user: user,
                isUpdating: false,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_updatePosition(req, res) {
        try {
            const user = await getCurrentUser(req);
            const specifiedPosition = await getSpecifiedObject(req.params.id, positionDBs);
            res.render('admin_employee_add-position', {
                user: user,
                isUpdating: true,
                specifiedPosition: specifiedPosition,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
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
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_addDepartment(req, res) {
        try {
            const user = await getCurrentUser(req);
            res.render('admin_employee_add-department', {
                user: user,
                isUpdating: false,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_updateDepartment(req, res) {
        try {
            const user = await getCurrentUser(req);
            const specifiedDepartment = await getSpecifiedObject(req.params.id, departmentDBs);
            res.render('admin_employee_add-department', {
                user: user,
                isUpdating: true,
                specifiedDepartment: specifiedDepartment,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_salaryList(req, res) {
        try {
            const salaryInfoList = await getAllSalary();
            const user = await getCurrentUser(req);
            res.render('admin_salary_salary-list', {
                user: user,
                salaryInfoList: salaryInfoList,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_addSalary(req, res) {
        try {
            const user = await getCurrentUser(req);
            const allUsers = await getAllUser();
            const degreeList = await getAllDegree();
            const salaryList = await getAllSalary();
            const positionList = await getAllPosition();
            const employeeTypeList = await getAllEmployeeType();
            const departmentList = await getAllDepartment();
            res.render('admin_salary_add-salary', {
                user: user,
                allUsers: allUsers,
                degreeList: degreeList,
                employeeTypeList: employeeTypeList,
                salaryList: salaryList,
                positionList: positionList,
                departmentList: departmentList,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
}

module.exports = new renderMethods;