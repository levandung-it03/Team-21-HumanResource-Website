const axios = require('axios');
const authMethods = require('../auth/auth.methods');
require('dotenv').config();
const DOMAIN = process.env.DOMAIN;

const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const client = new MongoClient(process.env.MONGO_URI);
const groupDBs = client.db('company').collection('group');
const userDBs = client.db('company').collection('userdbs');
const salaryDBs = client.db('company').collection('salary');
const degreeDBs = client.db('company').collection('degree');
const positionDBs = client.db('company').collection('position');
const bussinessDBs = client.db('company').collection('bussiness');
const compliment_typeDBs = client.db('company').collection('compliment_type');
const group_complimentsDBs = client.db('company').collection('group_compliments');
const employee_complimentsDBs = client.db('company').collection('employee_compliments');
const techniqueDBs = client.db('company').collection('technique');
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

async function getAllTechnique() {
    const allTechnique = techniqueDBs.find({});
    return await allTechnique.toArray();
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

async function getAllEmployees() {
    const allEmployees = userDBs.find({});
    return await allEmployees.toArray();
}

async function getAllBussiness() {
    const allBussiness = bussinessDBs.find({});
    return await allBussiness.toArray();
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

async function getAllGroup() {
    const allGroup = groupDBs.find({});
    return await allGroup.toArray();
}

async function getAllCompliment_type() {
    const allCompliment_type = compliment_typeDBs.find({});
    return await allCompliment_type.toArray();
}

async function getEmployeeComplimentsList() {
    const employeeComplimentsList = employee_complimentsDBs.find({});
    return await employeeComplimentsList.toArray();
}

async function getGroupComplimentsList () {
    const groupComplimentsList = group_complimentsDBs.find({});
    return await groupComplimentsList.toArray();
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
            const allEmployees = await getAllEmployees();
            const user = await getCurrentUser(req);
            res.render('admin_general', {
                user: user,
                employeeList: allEmployees,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_employeeList(req, res) {
        try {
            const allEmployees = await getAllEmployees();
            const user = await getCurrentUser(req);
            res.render('admin_employee_employee-list', {
                user: user,
                employeeList: allEmployees,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_employeeView(req, res) {
        try {
            const specifiedEmployee = await getSpecifiedObject(req.params.id, userDBs);
            const user = await getCurrentUser(req);
            res.render('admin_employee_view', {
                user: user,
                specifiedEmployee: specifiedEmployee,
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
            const allEmployees = await getAllEmployees();
            const user = await getCurrentUser(req);
            res.render('admin_employee_account-list', {
                user: user,
                employeeList: allEmployees,
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
    async admin_techniqueList(req, res) {
        try {
            const user = await getCurrentUser(req);
            const techniqueList = await getAllTechnique();
            res.render('admin_employee_technique-list', {
                user: user,
                techniqueList: techniqueList,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_addTechnique(req, res) {
        try {
            const user = await getCurrentUser(req);
            const allEmployees = await getAllEmployees();
            res.render('admin_employee_add-technique', {
                user: user,
                isUpdating: false,
                allEmployees: allEmployees,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_updateTechnique(req, res) {
        try {
            const user = await getCurrentUser(req);
            const allEmployees = await getAllEmployees();
            const specifiedTechnique = await getSpecifiedObject(req.params.id, techniqueDBs);
            res.render('admin_employee_add-technique', {
                user: user,
                isUpdating: true,
                allEmployees: allEmployees,
                specifiedTechnique: specifiedTechnique,
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
            const allEmployees = await getAllEmployees();
            const degreeList = await getAllDegree();
            const salaryList = await getAllSalary();
            const positionList = await getAllPosition();
            const employeeTypeList = await getAllEmployeeType();
            const departmentList = await getAllDepartment();
            res.render('admin_salary_add-salary', {
                user: user,
                allEmployees: allEmployees,
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
    async admin_bussinessList(req, res) {
        try {
            const bussinessList = await getAllBussiness();
            const user = await getCurrentUser(req);
            res.render('admin_bussiness_bussiness-list', {
                user: user,
                bussinessList: bussinessList,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_addBussiness(req, res) {
        try {
            const user = await getCurrentUser(req);
            const allEmployees = await getAllEmployees();
            res.render('admin_bussiness_add-bussiness', {
                user: user,
                allEmployees: allEmployees,
                isUpdating: false,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_updateBussiness(req, res) {
        try {
            const user = await getCurrentUser(req);
            const specifiedBussiness = await getSpecifiedObject(req.params.id, bussinessDBs);
            const allEmployees = await getAllEmployees();
            res.render('admin_bussiness_add-bussiness', {
                user: user,
                allEmployees: allEmployees,
                isUpdating: true,
                specifiedBussiness: specifiedBussiness,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_groupList(req, res) {
        try {
            const groupList = await getAllGroup();
            const user = await getCurrentUser(req);
            res.render('admin_group_group-list', {
                user: user,
                groupList: groupList,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_addGroup(req, res) {
        try {
            const allEmployees = await getAllEmployees();
            const allTechnique = await getAllTechnique();
            const user = await getCurrentUser(req);
            res.render('admin_group_add-group', {
                user: user,
                allEmployees: allEmployees,
                isUpdating: false,
                allTechnique: allTechnique,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_updateGroup(req, res) {
        try {
            const allEmployees = await getAllEmployees();
            const specifiedGroup = await getSpecifiedObject(req.params.id, groupDBs);
            const allTechnique = await getAllTechnique();
            const user = await getCurrentUser(req);
            res.render('admin_group_add-group', {
                user: user,
                allEmployees: allEmployees,
                specifiedGroup: specifiedGroup,
                isUpdating: true,
                allTechnique: allTechnique,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_viewGroup(req, res) {
        try {
            const specifiedGroup = await getSpecifiedObject(req.params.id, groupDBs);
            const user = await getCurrentUser(req);
            res.render('admin_group_view-group', {
                user: user,
                isFromComplimentsList: false,
                idInComplimentDBs: null,
                specifiedGroup: specifiedGroup,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_addEmployeeIntoGroup(req, res) {
        try {
            const allTechnique = await getAllTechnique();
            const allEmployees = await getAllEmployees();
            const specifiedGroup = await getSpecifiedObject(req.params.id, groupDBs);
            const user = await getCurrentUser(req);
            res.render('admin_group_add-employee-into-group', {
                user: user,
                allEmployees: allEmployees,
                specifiedGroup: specifiedGroup,
                allTechnique: allTechnique,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_complimentType(req, res) {
        try {
            const allCompliment_type = await getAllCompliment_type();
            const user = await getCurrentUser(req);
            res.render('admin_compliment_compliment-type', {
                user: user,
                allCompliment_type: allCompliment_type,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_addComplimentType(req, res) {
        try {
            const user = await getCurrentUser(req);
            res.render('admin_compliment_add-compliment-type', {
                user: user,
                isUpdating: false,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_updateComplimentType(req, res) {
        try {
            const user = await getCurrentUser(req);
            const specifiedComplimentType = await getSpecifiedObject(req.params.id, compliment_typeDBs);
            res.render('admin_compliment_add-compliment-type', {
                user: user,
                isUpdating: true,
                specifiedComplimentType: specifiedComplimentType,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_employeeComplimentsList(req, res) {
        try {
            const employeeComplimentsList = await getEmployeeComplimentsList(req.params.id, employee_complimentsDBs);
            const user = await getCurrentUser(req);
            res.render('admin_compliment_employee-compliments-list', {
                user: user,
                employeeComplimentsList: employeeComplimentsList,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_addEmployeeCompliment(req, res) {
        try {
            const allEmployees = await getAllEmployees();
            const allCompliment_type = await getAllCompliment_type();
            const user = await getCurrentUser(req);
            const employeeId = req.params.employeeId;
            if (employeeId != undefined) {
                const specifiedEmployee = await getSpecifiedObject(employeeId, employee_complimentsDBs);
                res.render('admin_compliment_add-employee-compliment', {
                    user: user,
                    isUpdating: false,
                    employeeId: employeeId,
                    specifiedEmployee: specifiedEmployee,
                    allCompliment_type: allCompliment_type,
                    allEmployees: allEmployees,
                    layout: './layouts/admin'
                });
            } else {
                res.render('admin_compliment_add-employee-compliment', {
                    user: user,
                    isUpdating: false,
                    specifiedEmployee: undefined,
                    allCompliment_type: allCompliment_type,
                    allEmployees: allEmployees,
                    layout: './layouts/admin'
                });
            }
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_viewEmployeeCompliments(req, res) {
        try {
            const specifiedEmployeeInComplimentDBs =
                await getSpecifiedObject(req.params.id, employee_complimentsDBs);
            const specifiedEmployee =
                await userDBs.findOne({ employee_code: specifiedEmployeeInComplimentDBs.employee_code });
            const user = await getCurrentUser(req);
            res.render('admin_compliment_employee-compliments-view', {
                user: user,
                specifiedEmployee: specifiedEmployee,
                specifiedEmployeeInComplimentDBs: specifiedEmployeeInComplimentDBs,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_updateEmployeeCompliment(req, res) {
        try {
            const allEmployees = await getAllEmployees();
            const allCompliment_type = await getAllCompliment_type();
            const user = await getCurrentUser(req);
            const specifiedEmployee = await getSpecifiedObject(req.params.employeeId, employee_complimentsDBs);
            const specifiedCompliment =
                specifiedEmployee.compliments_list.find(compliment => compliment._id.toString() == req.params.id);
                
            res.render('admin_compliment_add-employee-compliment', {
                user: user,
                isUpdating: true,
                specifiedEmployee: specifiedEmployee,
                specifiedCompliment: specifiedCompliment,
                allCompliment_type: allCompliment_type,
                allEmployees: allEmployees,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_groupComplimentsList(req, res) {
        try {
            const groupComplimentsList = await getGroupComplimentsList(req.params.id, group_complimentsDBs);
            const user = await getCurrentUser(req);
            res.render('admin_compliment_group-compliments-list', {
                user: user,
                groupComplimentsList: groupComplimentsList,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_addGroupCompliment(req, res) {
        try {
            const allGroups = await getAllGroup();
            const allCompliment_type = await getAllCompliment_type();
            const user = await getCurrentUser(req);
            const groupId = req.params.groupId;
            if (groupId != undefined) {
                const specifiedGroup = await getSpecifiedObject(groupId, group_complimentsDBs);
                res.render('admin_compliment_add-group-compliment', {
                    user: user,
                    isUpdating: false,
                    specifiedGroup: specifiedGroup,
                    allCompliment_type: allCompliment_type,
                    allGroups: allGroups,
                    layout: './layouts/admin'
                });
            } else {
                res.render('admin_compliment_add-group-compliment', {
                    user: user,
                    isUpdating: false,
                    specifiedGroup: undefined,
                    allCompliment_type: allCompliment_type,
                    allGroups: allGroups,
                    layout: './layouts/admin'
                });
            }
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_viewGroupCompliments(req, res) {
        try {
            const specifiedGroupInComplimentDBs =
                await getSpecifiedObject(req.params.id, group_complimentsDBs);
            const specifiedGroup =
                await groupDBs.findOne({ group_code: specifiedGroupInComplimentDBs.group_code });
            const user = await getCurrentUser(req);
            res.render('admin_compliment_group-compliments-view', {
                user: user,
                specifiedGroup: specifiedGroup,
                specifiedGroupInComplimentDBs: specifiedGroupInComplimentDBs,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_viewSpecifiedGroupOfComplimentsList(req, res) {
        try {
            const specifiedGroup = await getSpecifiedObject(req.params.id, groupDBs);
            const idInComplimentDBs = req.params.idInComplimentDBs;
            const user = await getCurrentUser(req);
            res.render('admin_group_view-group', {
                user: user,
                isFromComplimentsList: true,
                idInComplimentDBs: idInComplimentDBs,
                specifiedGroup: specifiedGroup,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_addGroupCompliment(req, res) {
        try {
            const allGroups = await getAllGroup();
            const allCompliment_type = await getAllCompliment_type();
            const user = await getCurrentUser(req);
            const groupId = req.params.groupId;
            if (groupId != undefined) {
                const specifiedGroup = await getSpecifiedObject(groupId, group_complimentsDBs);
                res.render('admin_compliment_add-group-compliment', {
                    user: user,
                    groupId: groupId,
                    isUpdating: false,
                    specifiedGroup: specifiedGroup,
                    allCompliment_type: allCompliment_type,
                    allGroups: allGroups,
                    layout: './layouts/admin'
                });
            } else {
                res.render('admin_compliment_add-group-compliment', {
                    user: user,
                    isUpdating: false,
                    specifiedGroup: undefined,
                    allCompliment_type: allCompliment_type,
                    allGroups: allGroups,
                    layout: './layouts/admin'
                });
            }
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_updateGroupCompliment(req, res) {
        try {
            const allGroups = await getAllGroup();
            const allCompliment_type = await getAllCompliment_type();
            const user = await getCurrentUser(req);
            const specifiedGroup = await getSpecifiedObject(req.params.groupId, group_complimentsDBs);
            const specifiedCompliment =
                specifiedGroup.compliments_list.find(compliment => compliment._id.toString() == req.params.id);
                
            res.render('admin_compliment_add-group-compliment', {
                user: user,
                isUpdating: true,
                specifiedGroup: specifiedGroup,
                specifiedCompliment: specifiedCompliment,
                allCompliment_type: allCompliment_type,
                allGroups: allGroups,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
}

module.exports = new renderMethods;