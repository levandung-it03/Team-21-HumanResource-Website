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
const discipline_typeDBs = client.db('company').collection('discipline_type');
const contract_typeDBs = client.db('company').collection('contract_type');
const contractDBs = client.db('company').collection('contract');
const insuranceDBs = client.db('company').collection('insurance');
const employee_disciplineDBs = client.db('company').collection('employee_discipline');
const group_disciplineDBs = client.db('company').collection('group_discipline');
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


async function getSpecifiedObject(id, db) {
    const object = await db.findOne({ _id: new ObjectId(id) });
    return object;
}

async function getCurrentUser(req) {
    const cookiesList = authMethods.handleCookie(req.headers.cookie);
    const user = await getSpecifiedObject(cookiesList.id, userDBs);

    return user;
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

async function getGroupComplimentsList() {
    const groupComplimentsList = group_complimentsDBs.find({});
    return await groupComplimentsList.toArray();
}

async function getAllDiscipline_type() {
    const allDiscipline_type = discipline_typeDBs.find({});
    return await allDiscipline_type.toArray();
}

async function getEmployeeDisciplineList() {
    const employeeDisciplineList = employee_disciplineDBs.find({});
    return await employeeDisciplineList.toArray();
}

async function getGroupDisciplineList() {
    const groupDisciplineList = group_disciplineDBs.find({});
    return await groupDisciplineList.toArray();
}

async function getAllContractType() {
    const allContractType = contract_typeDBs.find({});
    return await allContractType.toArray();
}

async function getAllContract() {
    const allContract = contractDBs.find({});
    return await allContract.toArray();
}

async function getAllInsurance() {
    const allInsurance = insuranceDBs.find({});
    return await allInsurance.toArray();
}

class renderMethods {
    getHome(req, res) {
        const cookiesList = authMethods.handleCookie(req.headers.cookie);
        if (cookiesList.admin == 1) {
            res.redirect('/admin/general');
        } else {
            res.redirect('/employee/general');
        }
    }
    login(req, res) {
        res.render('login', { layout: './login' });
    }
    password(req, res) {
        res.render('password', { layout: './password' });
    }
    async changePassword(req, res) {
        try {
            const user = await getCurrentUser(req);
            if (user.admin == 1) {
                res.render('change-password', {
                    user: user,
                    layout: './layouts/admin'
                });
            } else if (user.admin == 0) {
                res.render('change-password', {
                    user: user,
                    layout: './layouts/employee'
                });
            } else {
                clearCookiesAndReturnLogin(res);
            }
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_general(req, res) {
        try {
            const user = await getCurrentUser(req);
            const allEmployees = await getAllEmployees();
            const allDepartments = await getAllDepartment();
            const allPositions = await getAllPosition();
            const allGroups = await getAllGroup();
            const allBussiness = await getAllBussiness();
            res.render('./admin/admin_general', {
                user: user,
                allEmployees: allEmployees,
                allDepartments: allDepartments,
                allPositions: allPositions,
                allGroups: allGroups,
                allBussiness: allBussiness,
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
            res.render('./admin/admin_employee_employee-list', {
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
            res.render('./admin/admin_employee_view', {
                user: user,
                isFromContract: false,
                isFromInsurance: false,
                specifiedEmployee: specifiedEmployee,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_addEmployee(req, res) {
        try {
            const degreeList = await getAllDegree();
            const positionList = await getAllPosition();
            const departmentList = await getAllDepartment();
            const employeeTypeList = await getAllEmployeeType();
            const user = await getCurrentUser(req);
            res.render('./admin/admin_employee_add-employee', {
                user: user,
                isUpdating: false,
                degreeList: degreeList,
                departmentList: departmentList,
                positionList: positionList,
                employeeTypeList: employeeTypeList,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_updateEmployee(req, res) {
        try {
            const degreeList = await getAllDegree();
            const positionList = await getAllPosition();
            const departmentList = await getAllDepartment();
            const employeeTypeList = await getAllEmployeeType();
            const user = await getCurrentUser(req);
            const specifiedUser = await getSpecifiedObject(req.params.id, userDBs);
            res.render('./admin/admin_employee_add-employee', {
                user: user,
                specifiedUser: specifiedUser,
                isUpdating: true,
                degreeList: degreeList,
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
            res.render('./admin/admin_employee_account-list', {
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
            res.render('./admin/admin_employee_employee-type-list', {
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
            res.render('./admin/admin_employee_add-employee-type', {
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
            res.render('./admin/admin_employee_add-employee-type', {
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
            res.render('./admin/admin_employee_degree-list', {
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
            res.render('./admin/admin_employee_add-degree', {
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
            res.render('./admin/admin_employee_add-degree', {
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
            res.render('./admin/admin_employee_technique-list', {
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
            res.render('./admin/admin_employee_add-technique', {
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
            res.render('./admin/admin_employee_add-technique', {
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
            res.render('./admin/admin_employee_position-list', {
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
            res.render('./admin/admin_employee_add-position', {
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
            res.render('./admin/admin_employee_add-position', {
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
            res.render('./admin/admin_employee_department-list', {
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
            res.render('./admin/admin_employee_add-department', {
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
            res.render('./admin/admin_employee_add-department', {
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
            res.render('./admin/admin_salary_salary-list', {
                user: user,
                salaryInfoList: salaryInfoList,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_viewSalary(req, res) {
        try {
            const specifiedEmployeeInSalaryDBs =
                await getSpecifiedObject(req.params.id, salaryDBs);
            const specifiedEmployee =
                await userDBs.findOne({ employee_code: specifiedEmployeeInSalaryDBs.employee_code });
            const specifiedContract =
                await contractDBs.findOne({ employee_code: specifiedEmployeeInSalaryDBs.employee_code });
            const user = await getCurrentUser(req);
            res.render('./admin/admin_salary_view-salary', {
                user: user,
                specifiedEmployee: specifiedEmployee,
                specifiedContract: specifiedContract,
                specifiedEmployeeInSalaryDBs: specifiedEmployeeInSalaryDBs,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_addSalary(req, res) {
        try {
            const user = await getCurrentUser(req);
            const allEmployees = userDBs.find({ status: "Đang làm việc" });
            const degreeList = await getAllDegree();
            const salaryList = await getAllSalary();
            const positionList = await getAllPosition();
            const employeeTypeList = await getAllEmployeeType();
            const departmentList = await getAllDepartment();
            const employeeId = req.params.id;
            if (employeeId != undefined) {
                const specifiedEmployee = salaryList.find(e => e._id == employeeId);
                res.render('./admin/admin_salary_add-salary', {
                    user: user,
                    allEmployees: await allEmployees.toArray(),
                    employeeId: employeeId,
                    specifiedEmployee: specifiedEmployee,
                    degreeList: degreeList,
                    employeeTypeList: employeeTypeList,
                    salaryList: salaryList,
                    positionList: positionList,
                    departmentList: departmentList,
                    layout: './layouts/admin'
                });
            } else {
                res.render('./admin/admin_salary_add-salary', {
                    user: user,
                    allEmployees: await allEmployees.toArray(),
                    employeeId: undefined,
                    degreeList: degreeList,
                    employeeTypeList: employeeTypeList,
                    salaryList: salaryList,
                    positionList: positionList,
                    departmentList: departmentList,
                    layout: './layouts/admin'
                });
            }
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_bussinessList(req, res) {
        try {
            const bussinessList = await getAllBussiness();
            const user = await getCurrentUser(req);
            res.render('./admin/admin_bussiness_bussiness-list', {
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
            const allEmployees = userDBs.find({ status: "Đang làm việc" });
            res.render('./admin/admin_bussiness_add-bussiness', {
                user: user,
                allEmployees: await allEmployees.toArray(),
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
            const allEmployees = userDBs.find({ status: "Đang làm việc" });
            res.render('./admin/admin_bussiness_add-bussiness', {
                user: user,
                allEmployees: await allEmployees.toArray(),
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
            res.render('./admin/admin_group_group-list', {
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
            const allEmployees = userDBs.find({ status: "Đang làm việc" });
            const allTechnique = await getAllTechnique();
            const user = await getCurrentUser(req);
            res.render('./admin/admin_group_add-group', {
                user: user,
                allEmployees: await allEmployees.toArray(),
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
            res.render('./admin/admin_group_add-group', {
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
            res.render('./admin/admin_group_view-group', {
                user: user,
                idInComplimentDBs: null,
                idInDisciplineDBs: null,
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
            const allEmployees = userDBs.find({ status: "Đang làm việc" });
            const specifiedGroup = await getSpecifiedObject(req.params.id, groupDBs);
            const user = await getCurrentUser(req);
            res.render('./admin/admin_group_add-employee-into-group', {
                user: user,
                allEmployees: await allEmployees.toArray(),
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
            res.render('./admin/admin_compliment_compliment-type', {
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
            res.render('./admin/admin_compliment_add-compliment-type', {
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
            res.render('./admin/admin_compliment_add-compliment-type', {
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
            res.render('./admin/admin_compliment_employee-compliments-list', {
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
            const allEmployees = userDBs.find({ status: "Đang làm việc" });
            const allCompliment_type = await getAllCompliment_type();
            const user = await getCurrentUser(req);
            const employeeId = req.params.employeeId;
            if (employeeId != undefined) {
                const specifiedEmployee = await getSpecifiedObject(employeeId, employee_complimentsDBs);
                res.render('./admin/admin_compliment_add-employee-compliment', {
                    user: user,
                    isUpdating: false,
                    employeeId: employeeId,
                    specifiedEmployee: specifiedEmployee,
                    allCompliment_type: allCompliment_type,
                    allEmployees: await allEmployees.toArray(),
                    layout: './layouts/admin'
                });
            } else {
                res.render('./admin/admin_compliment_add-employee-compliment', {
                    user: user,
                    isUpdating: false,
                    specifiedEmployee: undefined,
                    allCompliment_type: allCompliment_type,
                    allEmployees: await allEmployees.toArray(),
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
            res.render('./admin/admin_compliment_employee-compliments-view', {
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
            const allEmployees = userDBs.find({ status: "Đang làm việc" });
            const allCompliment_type = await getAllCompliment_type();
            const user = await getCurrentUser(req);
            const specifiedEmployee = await getSpecifiedObject(req.params.employeeId, employee_complimentsDBs);
            const specifiedCompliment =
                specifiedEmployee.compliments_list.find(compliment => compliment._id.toString() == req.params.id);

            res.render('./admin/admin_compliment_add-employee-compliment', {
                user: user,
                isUpdating: true,
                specifiedEmployee: specifiedEmployee,
                specifiedCompliment: specifiedCompliment,
                allCompliment_type: allCompliment_type,
                allEmployees: await allEmployees.toArray(),
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
            res.render('./admin/admin_compliment_group-compliments-list', {
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
                res.render('./admin/admin_compliment_add-group-compliment', {
                    user: user,
                    isUpdating: false,
                    specifiedGroup: specifiedGroup,
                    allCompliment_type: allCompliment_type,
                    allGroups: allGroups,
                    layout: './layouts/admin'
                });
            } else {
                res.render('./admin/admin_compliment_add-group-compliment', {
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
            res.render('./admin/admin_compliment_group-compliments-view', {
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
            res.render('./admin/admin_group_view-group', {
                user: user,
                idInDisciplineDBs: null,
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
                res.render('./admin/admin_compliment_add-group-compliment', {
                    user: user,
                    groupId: groupId,
                    isUpdating: false,
                    specifiedGroup: specifiedGroup,
                    allCompliment_type: allCompliment_type,
                    allGroups: allGroups,
                    layout: './layouts/admin'
                });
            } else {
                res.render('./admin/admin_compliment_add-group-compliment', {
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

            res.render('./admin/admin_compliment_add-group-compliment', {
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
    async admin_disciplineType(req, res) {
        try {
            const allDiscipline_type = await getAllDiscipline_type();
            const user = await getCurrentUser(req);
            res.render('./admin/admin_discipline_discipline-type', {
                user: user,
                allDiscipline_type: allDiscipline_type,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_addDisciplineType(req, res) {
        try {
            const user = await getCurrentUser(req);
            res.render('./admin/admin_discipline_add-discipline-type', {
                user: user,
                isUpdating: false,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_updateDisciplineType(req, res) {
        try {
            const user = await getCurrentUser(req);
            const specifiedDisciplineType = await getSpecifiedObject(req.params.id, discipline_typeDBs);
            res.render('./admin/admin_discipline_add-discipline-type', {
                user: user,
                isUpdating: true,
                specifiedDisciplineType: specifiedDisciplineType,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_employeeDisciplineList(req, res) {
        try {
            const employeeDisciplineList = await getEmployeeDisciplineList(req.params.id, employee_disciplineDBs);
            const user = await getCurrentUser(req);
            res.render('./admin/admin_discipline_employee-discipline-list', {
                user: user,
                employeeDisciplineList: employeeDisciplineList,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_addEmployeeDiscipline(req, res) {
        try {
            const allEmployees = userDBs.find({ status: "Đang làm việc" });
            const allDiscipline_type = await getAllDiscipline_type();
            const user = await getCurrentUser(req);
            const employeeId = req.params.employeeId;
            if (employeeId != undefined) {
                const specifiedEmployee = await getSpecifiedObject(employeeId, employee_disciplineDBs);
                res.render('./admin/admin_discipline_add-employee-discipline', {
                    user: user,
                    isUpdating: false,
                    employeeId: employeeId,
                    specifiedEmployee: specifiedEmployee,
                    allDiscipline_type: allDiscipline_type,
                    allEmployees: await allEmployees.toArray(),
                    layout: './layouts/admin'
                });
            } else {
                res.render('./admin/admin_discipline_add-employee-discipline', {
                    user: user,
                    isUpdating: false,
                    specifiedEmployee: undefined,
                    allDiscipline_type: allDiscipline_type,
                    allEmployees: await allEmployees.toArray(),
                    layout: './layouts/admin'
                });
            }
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_viewEmployeeDiscipline(req, res) {
        try {
            const specifiedEmployeeInDisciplineDBs =
                await getSpecifiedObject(req.params.id, employee_disciplineDBs);
            const specifiedEmployee =
                await userDBs.findOne({ employee_code: specifiedEmployeeInDisciplineDBs.employee_code });
            const user = await getCurrentUser(req);
            res.render('./admin/admin_discipline_employee-discipline-view', {
                user: user,
                specifiedEmployee: specifiedEmployee,
                specifiedEmployeeInDisciplineDBs: specifiedEmployeeInDisciplineDBs,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_updateEmployeeDiscipline(req, res) {
        try {
            const allEmployees = userDBs.find({ status: "Đang làm việc" });
            const allDiscipline_type = await getAllDiscipline_type();
            const user = await getCurrentUser(req);
            const specifiedEmployee = await getSpecifiedObject(req.params.employeeId, employee_disciplineDBs);
            const specifiedDiscipline =
                specifiedEmployee.discipline_list.find(discipline => discipline._id.toString() == req.params.id);

            res.render('./admin/admin_discipline_add-employee-discipline', {
                user: user,
                isUpdating: true,
                specifiedEmployee: specifiedEmployee,
                specifiedDiscipline: specifiedDiscipline,
                allDiscipline_type: allDiscipline_type,
                allEmployees: allEmployees,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_groupDisciplineList(req, res) {
        try {
            const groupDisciplineList = await getGroupDisciplineList(req.params.id, group_disciplineDBs);
            const user = await getCurrentUser(req);
            res.render('./admin/admin_discipline_group-discipline-list', {
                user: user,
                groupDisciplineList: groupDisciplineList,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_addGroupDiscipline(req, res) {
        try {
            const allGroups = await getAllGroup();
            const allDiscipline_type = await getAllDiscipline_type();
            const user = await getCurrentUser(req);
            const groupId = req.params.groupId;
            if (groupId != undefined) {
                const specifiedGroup = await getSpecifiedObject(groupId, group_disciplineDBs);
                res.render('./admin/admin_discipline_add-group-discipline', {
                    user: user,
                    isUpdating: false,
                    specifiedGroup: specifiedGroup,
                    allDiscipline_type: allDiscipline_type,
                    allGroups: allGroups,
                    layout: './layouts/admin'
                });
            } else {
                res.render('./admin/admin_discipline_add-group-discipline', {
                    user: user,
                    isUpdating: false,
                    specifiedGroup: undefined,
                    allDiscipline_type: allDiscipline_type,
                    allGroups: allGroups,
                    layout: './layouts/admin'
                });
            }
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_viewGroupDiscipline(req, res) {
        try {
            const specifiedGroupInDisciplineDBs =
                await getSpecifiedObject(req.params.id, group_disciplineDBs);
            const specifiedGroup =
                await groupDBs.findOne({ group_code: specifiedGroupInDisciplineDBs.group_code });
            const user = await getCurrentUser(req);
            res.render('./admin/admin_discipline_group-discipline-view', {
                user: user,
                specifiedGroup: specifiedGroup,
                specifiedGroupInDisciplineDBs: specifiedGroupInDisciplineDBs,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_viewSpecifiedGroupOfDisciplineList(req, res) {
        try {
            const specifiedGroup = await getSpecifiedObject(req.params.id, groupDBs);
            const idInDisciplineDBs = req.params.idInDisciplineDBs;
            const user = await getCurrentUser(req);
            res.render('./admin/admin_group_view-group', {
                user: user,
                idInComplimentDBs: null,
                idInDisciplineDBs: idInDisciplineDBs,
                specifiedGroup: specifiedGroup,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_addGroupDiscipline(req, res) {
        try {
            const allGroups = await getAllGroup();
            const allDiscipline_type = await getAllDiscipline_type();
            const user = await getCurrentUser(req);
            const groupId = req.params.groupId;
            if (groupId != undefined) {
                const specifiedGroup = await getSpecifiedObject(groupId, group_disciplineDBs);
                res.render('./admin/admin_discipline_add-group-discipline', {
                    user: user,
                    groupId: groupId,
                    isUpdating: false,
                    specifiedGroup: specifiedGroup,
                    allDiscipline_type: allDiscipline_type,
                    allGroups: allGroups,
                    layout: './layouts/admin'
                });
            } else {
                res.render('./admin/admin_discipline_add-group-discipline', {
                    user: user,
                    isUpdating: false,
                    specifiedGroup: undefined,
                    allDiscipline_type: allDiscipline_type,
                    allGroups: allGroups,
                    layout: './layouts/admin'
                });
            }
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_updateGroupDiscipline(req, res) {
        try {
            const allGroups = await getAllGroup();
            const allDiscipline_type = await getAllDiscipline_type();
            const user = await getCurrentUser(req);
            const specifiedGroup = await getSpecifiedObject(req.params.groupId, group_disciplineDBs);
            const specifiedDiscipline =
                specifiedGroup.discipline_list.find(discipline => discipline._id.toString() == req.params.id);

            res.render('./admin/admin_discipline_add-group-discipline', {
                user: user,
                isUpdating: true,
                specifiedGroup: specifiedGroup,
                specifiedDiscipline: specifiedDiscipline,
                allDiscipline_type: allDiscipline_type,
                allGroups: allGroups,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_insuranceList(req, res) {
        try {
            const user = await getCurrentUser(req);
            const insuranceList = await getAllInsurance();
            res.render('./admin/admin_insurance_insurance-list', {
                user: user,
                insuranceList: insuranceList,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_addInsurance(req, res) {
        try {
            const user = await getCurrentUser(req);
            const allEmployees = userDBs.find({ status: "Đang làm việc" });
            res.render('./admin/admin_insurance_add-insurance', {
                user: user,
                allEmployees: await allEmployees.toArray(),
                isUpdating: false,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_updateInsurance(req, res) {
        try {
            const user = await getCurrentUser(req);
            const allEmployees = userDBs.find({ status: "Đang làm việc" });
            const specifiedInsurance = await getSpecifiedObject(req.params.id, insuranceDBs);
            res.render('./admin/admin_insurance_add-insurance', {
                user: user,
                allEmployees: await allEmployees.toArray(),
                isUpdating: true,
                specifiedInsurance: specifiedInsurance,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_viewInsurance(req, res) {
        try {
            const specifiedInsurance = await getSpecifiedObject(req.params.id, insuranceDBs);
            const specifiedEmployee = await userDBs.findOne({ employee_code: specifiedInsurance.employee_code });
            const user = await getCurrentUser(req);
            res.render('./admin/admin_insurance_view-insurance', {
                user: user,
                specifiedEmployee: specifiedEmployee,
                specifiedInsurance: specifiedInsurance,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_viewEmployeeFromInsurance(req, res) {
        try {
            const specifiedEmployee = await getSpecifiedObject(req.params.id, userDBs);
            const user = await getCurrentUser(req);
            res.render('./admin/admin_employee_view', {
                user: user,
                isFromInsurance: true,
                isFromContract: false,
                insuranceId: req.params.insuranceId,
                specifiedEmployee: specifiedEmployee,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_contractType(req, res) {
        try {
            const user = await getCurrentUser(req);
            const allContractType = await getAllContractType();
            res.render('./admin/admin_contract_contract-type', {
                user: user,
                allContractType: allContractType,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_addContractType(req, res) {
        try {
            const user = await getCurrentUser(req);
            res.render('./admin/admin_contract_add-contract-type', {
                user: user,
                isUpdating: false,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_updateContractType(req, res) {
        try {
            const user = await getCurrentUser(req);
            const specifiedContractType = await getSpecifiedObject(req.params.id, contract_typeDBs);
            res.render('./admin/admin_contract_add-contract-type', {
                user: user,
                isUpdating: true,
                specifiedContractType: specifiedContractType,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_contractList(req, res) {
        try {
            const contractList = await getAllContract();
            const user = await getCurrentUser(req);
            res.render('./admin/admin_contract_contract-list', {
                user: user,
                contractList: contractList,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_addContract(req, res) {
        try {
            const user = await getCurrentUser(req);
            const allEmployees = userDBs.find({ status: "Đang làm việc" });
            const degreeList = await getAllDegree();
            const departmentList = await getAllDepartment();
            const employeeTypeList = await getAllEmployeeType();
            const positionList = await getAllPosition();
            const allContractType = await getAllContractType();
            res.render('./admin/admin_contract_add-contract', {
                user: user,
                isUpdating: false,
                allEmployees: await allEmployees.toArray(),
                degreeList: degreeList,
                departmentList: departmentList,
                employeeTypeList: employeeTypeList,
                allContractType: allContractType,
                positionList: positionList,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_updateContract(req, res) {
        try {
            const user = await getCurrentUser(req);
            const allEmployees = userDBs.find({ status: "Đang làm việc" });
            const degreeList = await getAllDegree();
            const positionList = await getAllPosition();
            const departmentList = await getAllDepartment();
            const employeeTypeList = await getAllEmployeeType();
            const allContractType = await getAllContractType();
            const specifiedContract = await getSpecifiedObject(req.params.id, contractDBs);
            res.render('./admin/admin_contract_add-contract', {
                user: user,
                isUpdating: true,
                specifiedContract: specifiedContract,
                allEmployees: await allEmployees.toArray(),
                degreeList: degreeList,
                departmentList: departmentList,
                employeeTypeList: employeeTypeList,
                positionList: positionList,
                allContractType: allContractType,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_viewContract(req, res) {
        try {
            const specifiedContract = await getSpecifiedObject(req.params.id, contractDBs);
            const specifiedEmployee = await userDBs.findOne({ employee_code: specifiedContract.employee_code });
            const user = await getCurrentUser(req);
            res.render('./admin/admin_contract_view-contract', {
                user: user,
                specifiedContract: specifiedContract,
                specifiedEmployee: specifiedEmployee,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async admin_viewEmployeeFromContract(req, res) {
        try {
            const specifiedEmployee = await getSpecifiedObject(req.params.id, userDBs);
            const user = await getCurrentUser(req);
            res.render('./admin/admin_employee_view', {
                user: user,
                isFromInsurance: false,
                isFromContract: true,
                contractId: req.params.contractId,
                specifiedEmployee: specifiedEmployee,
                layout: './layouts/admin'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async employee_general(req, res) {
        const user = await getCurrentUser(req);
        res.render('./employee/employee_general', {
            user: user,
            layout: './layouts/employee'
        });
    }
    async employee_salary(req, res) {
        const user = await getCurrentUser(req);
        const salary = await salaryDBs.findOne({ employee_code: user.employee_code });
        const degree = await degreeDBs.findOne({ degree: user.degree });
        const department = await departmentDBs.findOne({ department: user.department });
        const position = await positionDBs.findOne({ position: user.position });
        const employee_type = await employee_typeDBs.findOne({ employee_type: user.employee_type });
        let salaryList = 0;
        if (salary) {
            salaryList = salary.salaryList.sort((object_1, object_2) => {
                const data_1 = Date.parse(object_1.dateCreated);
                const data_2 = Date.parse(object_2.dateCreated);
    
                if (data_1 > data_2) return 1;
                if (data_1 < data_2) return -1;
                return 0;
            });
        }
        res.render('./employee/employee_salary', {
            user: user,
            degree: degree,
            department: department,
            position: position,
            employee_type: employee_type,
            salary: salary,
            salaryList: salaryList,
            layout: './layouts/employee'
        });
    }
    async employee_contract(req, res) {
        try {
            const user = await getCurrentUser(req);
            const specifiedContract = await contractDBs.findOne({ employee_code: user.employee_code });
            res.render('./employee/employee_contract', {
                user: user,
                specifiedContract: specifiedContract,
                layout: './layouts/employee'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async employee_insurance(req, res) {
        try {
            const user = await getCurrentUser(req);
            const specifiedInsurance = await insuranceDBs.findOne({ employee_code: user.employee_code });
            res.render('./employee/employee_insurance', {
                user: user,
                specifiedInsurance: specifiedInsurance,
                layout: './layouts/employee'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async employee_bussiness(req, res) {
        try {
            const user = await getCurrentUser(req);
            const specifiedBussiness = await bussinessDBs.findOne({ employee_code: user.employee_code });
            res.render('./employee/employee_bussiness', {
                user: user,
                specifiedBussiness: specifiedBussiness,
                layout: './layouts/employee'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async employee_group(req, res) {
        try {
            const user = await getCurrentUser(req);
            const specifiedGroup = await groupDBs.findOne({ "employee_list.employee_code": user.employee_code });
            res.render('./employee/employee_group', {
                user: user,
                specifiedGroup: specifiedGroup,
                layout: './layouts/employee'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async employee_compliment(req, res) {
        try {
            const user = await getCurrentUser(req);
            const specifiedCompliment = await employee_complimentsDBs.findOne({ employee_code: user.employee_code });
            res.render('./employee/employee_compliment', {
                user: user,
                specifiedCompliment: specifiedCompliment,
                layout: './layouts/employee'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
    async employee_discipline(req, res) {
        try {
            const user = await getCurrentUser(req);
            const specifiedDiscipline = await employee_disciplineDBs.findOne({ employee_code: user.employee_code });
            res.render('./employee/employee_discipline', {
                user: user,
                specifiedDiscipline: specifiedDiscipline,
                layout: './layouts/employee'
            });
        } catch (err) {
            clearCookiesAndReturnLogin(res);
        }
    }
}

module.exports = new renderMethods;