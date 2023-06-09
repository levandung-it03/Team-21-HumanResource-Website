require('dotenv').config();
const DOMAIN = process.env.DOMAIN;
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const cloudinary = require('cloudinary').v2;
const sharp = require('sharp');
const bcrypt = require('bcrypt');

const client = new MongoClient(process.env.MONGO_URI);
const userDBs = client.db('company').collection('userdbs');
const groupDBs = client.db('company').collection('group');
const salaryDBs = client.db('company').collection('salary');
const degreeDBs = client.db('company').collection('degree');
const compliment_typeDBs = client.db('company').collection('compliment_type');
const employee_complimentsDBs = client.db('company').collection('employee_compliments');
const group_complimentsDBs = client.db('company').collection('group_compliments');
const discipline_typeDBs = client.db('company').collection('discipline_type');
const employee_disciplineDBs = client.db('company').collection('employee_discipline');
const group_disciplineDBs = client.db('company').collection('group_discipline');
const positionDBs = client.db('company').collection('position');
const bussinessDBs = client.db('company').collection('bussiness');
const techniqueDBs = client.db('company').collection('technique');
const contract_typeDBs = client.db('company').collection('contract_type');
const contractDBs = client.db('company').collection('contract');
const insuranceDBs = client.db('company').collection('insurance');
const departmentDBs = client.db('company').collection('department');
const employee_typeDBs = client.db('company').collection('employee_type');

const usersMethods = require('./users.methods');
const authMethods = require('../auth/auth.methods');
const { UserDb, Salary, Position, Degree, Department, Employee_type, Technique, Bussiness, Group,
    Compliment_type, Employee_compliments, Group_compliments, Discipline_type, Employee_discipline,
    Group_discipline, Contract_type, Contract, Insurance } = require('./users.model');

function showErrMes(res, err) {
    res.status(500).send({ err_mes: err.message });
}

exports.addEmployee = async (req, res) => {
    if (!req.body) res.status(400).send({ message: "Content can not be empty!" }).end();

    await client.connect();

    const employee_code = usersMethods.getRandomEmployeeCode();
    const prevData = usersMethods.createErrorString(req.body);
    const password = usersMethods.getRandomUserPassword();
    const hasedPassword = usersMethods.getHasedPassword(password);

    const user = new UserDb({
        admin: 0,
        employee_code: employee_code,
        name: req.body.name,
        avatar_url: "",
        account: {
            email: req.body.email,
            password: hasedPassword,
        },
        dateCreated: usersMethods.getNowDate(),
        identifier: req.body.identifier,
        identifier_date: req.body.identifier_date,
        identifier_place: req.body.identifier_place,
        gender: req.body.gender,
        birthday: req.body.birthday,
        birthplace: req.body.birthplace,
        country: req.body.country,
        ethnic: req.body.ethnic,
        religion: req.body.religion,
        phone: req.body.phone,
        household: req.body.household,
        temporary_address: req.body.temporary_address,
        department: req.body.department,
        employee_type: req.body.employee_type,
        position: req.body.position,
        degree: req.body.degree,
        status: "Đang làm việc",
        refreshToken: "",
    })

    const sendingMailOptions = {
        body: req.body,
        subject: "HR Management Website",
        html: `<div>
                <p style="font-size: 18px">Không chia sẻ thông tin tài khoản phía dưới cho ai khác. Vui lòng bảo mật tốt thông tin của bạn!</p>
                <h2>Tài khoản: <b>${req.body.email}</b></h2>
                <h2>Mật khẩu: <b>${password}</b></h2>
            </div>`,
        flexibleOptions: {
            type: null,
        }
    }

    await user.save(user)
        .then(async (data) => {
            sharp(req.file.path)
                .resize({ height: 350 })
                .toBuffer(async (err, buffer) => {
                    try {
                        const stream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, async (err, result) => {
                            if (!err) {
                                await userDBs.updateOne({ employee_code: employee_code }, { "$set": { avatar_url: result.url } });
                                await usersMethods.sendingMail(sendingMailOptions);
                                res.redirect('/admin/category/employee/employee-list');
                            }
                        });
                        stream.write(buffer);
                        stream.end();
                    } catch (err) {
                        res.status(400).send({ uploadErrMessage: err.message })
                    }
                })
        })
        .catch((err) => {
            res.redirect('/admin/category/employee/add-employee?error=' + encodeURIComponent(`error_${Object.keys(err.keyValue)[0]}`) + prevData);
        })
}

exports.login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const hasedPassword = usersMethods.getHasedPassword(password);
    const prevData = '?email=' + email + '?password=';

    await client.connect();
    const user = await userDBs.findOne({ "account.email": email });
    const id = user._id.toString();

    const accessToken = authMethods.generateAccessToken({ id: id, admin: user.admin });
    let refreshToken = authMethods.generateRefreshToken({ id: id, admin: user.admin });

    if (!user.refreshToken) {
        await userDBs.updateOne(
            { "account.email": email },
            {
                "$set": { "tokens.refreshToken": refreshToken }
            });
    } else {
        refreshToken = user.refreshToken;
    }

    if (user) {
        bcrypt.compare(password, user.account.password, function (err, isValid) {
            if (isValid) {
                res.cookie('id', id)
                    .cookie('accessToken', accessToken, { httpOnly: true })
                    .cookie('refreshToken', refreshToken, { httpOnly: true })
                    .cookie('admin', user.admin)
                if (user.admin == 1) {
                    res.redirect('/admin/general');
                } else if (user.admin == 0) {
                    res.redirect('/employee/general');
                }
            } else {
                res.redirect('/login?error=' + encodeURIComponent('error_password') + prevData);
            }
        })
    } else {
        res.redirect('/login?error=' + encodeURIComponent('error_email') + prevData);
    }
    client.close();
}

exports.password = async (req, res) => {
    const newPassword = usersMethods.getRandomUserPassword();
    const newHasedPassword = usersMethods.getHasedPassword(newPassword);
    await client.connect();
    const user = await userDBs.findOne({ "account.email": req.body.email });
    if (!user) {
        res.redirect('/password?error=invalid_email+' + req.body.email);
    }

    try {
        const sendingMailOptions = {
            body: req.body,
            subject: "Làm mới mật khẩu HR Management Website!",
            html: `<p style="font-size: 18px">Vui lòng bảo mật tốt thông tin của bạn! Mật khẩu mới của bạn là: <h2><b>${newPassword}</b></h2>.</p>`,
            flexibleOptions: {
                type: "update_password",
                newPassword: newPassword,
                newHasedPassword: newHasedPassword,
                updateNewPassword: async function (email, newHasedPassword) {
                    await userDBs.updateOne(
                        { "account.email": email },
                        { "$set": { "account.password": newHasedPassword } }
                    )
                }
            },
        };
        await usersMethods.sendingMail(sendingMailOptions);
        res.redirect('/login');
    } catch (err) {
        res.status(500).send({ err_message: err.message })
    }

}

exports.logout = async (req, res) => {
    if (req.body.isLogout) {
        res.clearCookie('accessToken')
            .clearCookie('refreshToken')
            .clearCookie('id')
            .clearCookie('admin')
            .end();
    }
}

exports.updateEmployee = async (req, res) => {
    if (!req.body) res.status(400).send({ message: "Content can not be empty!" }).end();

    await client.connect();

    const prevData = usersMethods.createErrorString(req.body);
    const id = req.params.id;
    const user = await userDBs.findOne({ _id: new ObjectId(id) });

    const userdb = req.body;
    const account = {
        email: req.body.email,
        password: user.account.password
    };
    delete userdb.email;
    userdb.account = account;
    userdb.dateCreated = usersMethods.getNowDate();

    await userDBs.updateOne({ _id: new ObjectId(id) }, { "$set": userdb })
        .then(async (result) => {
            const public_id = usersMethods.getPublicIdByImageURL(user.avatar_url);
            try {
                await techniqueDBs.updateOne(
                    { employee_code: user.employee_code },
                    { "$set": { department: req.body.department, name: req.body.name } }
                );
                await groupDBs.updateOne(
                    { "employee_list.employee_code": user.employee_code },
                    {
                        "$set": {
                            "employee_list.$.employee_code": user.employee_code,
                            "employee_list.$.department": req.body.department,
                            "employee_list.$.name": req.body.name,
                            "employee_list.$.position": req.body.position,
                        }
                    }
                );
                await salaryDBs.updateOne(
                    { employee_code: user.employee_code },
                    {
                        "$set": {
                            employee_code: user.employee_code,
                            department: req.body.department,
                            name: req.body.name,
                            position: req.body.position,
                        }
                    }
                );
                sharp(req.file.path)
                    .resize({ height: 350 })
                    .toBuffer(async (err, buffer) => {
                        try {
                            const stream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, async (err, result) => {
                                if (!err) {
                                    await userDBs.updateOne({ _id: new ObjectId(id) }, { "$set": { avatar_url: result.url } });
                                    await groupDBs.updateOne({ "employee_list.employee_code": user.employee_code },
                                        { "$set": { "employee_list.$.avatar_url": { avatar_url: result.url } } });
                                    cloudinary.uploader.destroy(public_id);
                                    res.redirect('/admin/category/employee/employee-list');
                                }
                            });
                            stream.write(buffer);
                            stream.end();
                        } catch (err) {
                            res.status(400).send({ uploadErrMessage: err.message });
                        }
                    })
            } catch (err) {
                res.redirect('/admin/category/employee/employee-list');
            }
        })
        .catch(err => {
            res.redirect('/admin/category/employee/update-employee/' + id + '?error=' + encodeURIComponent(`error_${Object.keys(err.keyValue)[0]}`) + prevData);

        })
}

exports.deleteEmployee = async (req, res) => {
    const id = req.params.id;

    await client.connect();
    const user = await userDBs.findOne({ _id: new ObjectId(id) });
    const avatar_url = user.avatar_url;
    const public_id = usersMethods.getPublicIdByImageURL(avatar_url);

    await cloudinary.uploader.destroy(public_id)
        .then(async result => {
            await userDBs.deleteOne({ _id: new ObjectId(id) });
            res.end();
        })
}

exports.addEmployeeType = async (req, res) => {
    await client.connect();
    const employeeTypeObject = req.body;
    employeeTypeObject.employee_type_code = usersMethods.getRandomEmployeeTypeCode();

    employeeTypeObject.dateCreated = usersMethods.getNowDate();

    const prevData = usersMethods.createErrorString(req.body);

    const employeeTypeSchema = new Employee_type(employeeTypeObject);
    employeeTypeSchema.save()
        .then(data => {
            res.redirect('/admin/category/employee/employee-type-list');
        })
        .catch(err => {
            res.redirect('/admin/category/employee/add-employee-type?error=' + encodeURIComponent(`error_${Object.keys(err.keyValue)[0]}`) + prevData);
        })
}

exports.updateEmployeeType = async (req, res) => {
    try {
        await client.connect();
        const data = req.body;
        data.dateCreated = usersMethods.getNowDate();
        employee_typeDBs.updateOne(
            { _id: new ObjectId(req.params.id) },
            { "$set": data }
        )
        res.status(200).redirect('/admin/category/employee/employee-type-list');
    } catch (err) {
        res.status(500).send({ err_mes: err.message });
    }
}

exports.deleteEmployeeType = async (req, res) => {
    const id = req.params.id;

    try {
        await client.connect();
        await employee_typeDBs.deleteOne({ _id: new ObjectId(id) });
        res.end();
    } catch (err) {
        res.status(404).send({ mes: err.message });
    }
}

exports.addDegree = async (req, res) => {
    await client.connect();
    const degreeObject = req.body;
    degreeObject.degree_code = usersMethods.getRandomDegreeCode();

    degreeObject.dateCreated = usersMethods.getNowDate();

    const prevData = usersMethods.createErrorString(req.body);

    const degreeSchema = new Degree(degreeObject);
    degreeSchema.save()
        .then(data => {
            res.redirect('/admin/category/employee/degree-list');
        })
        .catch(err => {
            res.redirect('/admin/category/employee/add-degree?error=' + encodeURIComponent(`error_${Object.keys(err.keyValue)[0]}`) + prevData);
        })
}

exports.updateDegree = async (req, res) => {
    try {
        await client.connect();
        const data = req.body;
        data.dateCreated = usersMethods.getNowDate();

        await degreeDBs.updateOne(
            { _id: new ObjectId(req.params.id) },
            { "$set": data }
        )
        res.status(200).redirect('/admin/category/employee/degree-list');
    } catch (err) {
        res.status(500).send({ err_mes: err.message });
    }
}

exports.deleteDegree = async (req, res) => {
    const id = req.params.id;

    try {
        await client.connect();
        await degreeDBs.deleteOne({ _id: new ObjectId(id) });
        res.end();
    } catch (err) {
        res.status(404).send({ mes: err.message });
    }
}

exports.addTechnique = async (req, res) => {
    await client.connect();
    const [department, employee_code, name] = req.body.employee.split("-");
    const prevData = usersMethods.createErrorString(req.body);

    const dateCreated = usersMethods.getNowDate();
    const technique_code = usersMethods.getRandomTechniqueCode();

    const technique = new Technique({
        technique_code: technique_code,
        technique: req.body.technique,
        department: department,
        employee_code: employee_code,
        name: name,
        description: req.body.description,
        dateCreated: dateCreated
    })

    await technique.save(technique)
        .then(data => {
            res.status(200).redirect('/admin/category/employee/technique-list');
        })
        .catch(err => {
            res.redirect('/admin/category/employee/add-technique?error=' + encodeURIComponent(`error_${Object.keys(err.keyValue)[0]}`) + prevData);
        })
}

exports.updateTechnique = async (req, res) => {
    try {
        await client.connect();
        const data = {
            technique: req.body.technique,
            description: req.body.description,
            dateCreated: usersMethods.getNowDate()
        };
        techniqueDBs.updateOne(
            { _id: new ObjectId(req.params.id) },
            { "$set": data }
        )
        res.status(200).redirect('/admin/category/employee/technique-list');
    } catch (err) {
        res.status(500).send({ err_mes: err.message });
    }
}

exports.deleteTechnique = async (req, res) => {
    const id = req.params.id;

    try {
        await client.connect();
        await techniqueDBs.deleteOne({ _id: new ObjectId(id) });
        res.end();
    } catch (err) {
        res.status(404).send({ mes: err.message });
    }
}

exports.addPosition = async (req, res) => {
    await client.connect();
    const positionObject = req.body;
    positionObject.position_code = usersMethods.getRandomPositionCode();

    positionObject.dateCreated = usersMethods.getNowDate();

    const prevData = usersMethods.createErrorString(req.body);

    const positionSchema = new Position(positionObject);
    positionSchema.save()
        .then(data => {
            res.redirect('/admin/category/employee/position-list');
        })
        .catch(err => {
            res.redirect('/admin/category/employee/add-position?error=' + encodeURIComponent(`error_${Object.keys(err.keyValue)[0]}`) + prevData);
        })
}

exports.updatePosition = async (req, res) => {
    try {
        await client.connect();
        const data = req.body;
        data.dateCreated = usersMethods.getNowDate();
        positionDBs.updateOne(
            { _id: new ObjectId(req.params.id) },
            { "$set": data }
        )
        res.status(200).redirect('/admin/category/employee/position-list');
    } catch (err) {
        res.status(500).send({ err_mes: err.message });
    }
}

exports.deletePosition = async (req, res) => {
    const id = req.params.id;

    try {
        await client.connect();
        await positionDBs.deleteOne({ _id: new ObjectId(id) });
        res.end();
    } catch (err) {
        res.status(404).send({ mes: err.message });
    }
}

exports.addDepartment = async (req, res) => {
    await client.connect();
    const departmentObject = req.body;
    departmentObject.department_code = usersMethods.getRandomDepartmentCode();

    departmentObject.dateCreated = usersMethods.getNowDate();

    const prevData = usersMethods.createErrorString(req.body);

    const departmentSchema = new Department(departmentObject);
    departmentSchema.save()
        .then(data => {
            res.redirect('/admin/category/employee/department-list');
        })
        .catch(err => {
            res.redirect('/admin/category/employee/add-department?error=' + encodeURIComponent(`error_${Object.keys(err.keyValue)[0]}`) + prevData);
        })
}

exports.updateDepartment = async (req, res) => {
    try {
        await client.connect();
        const data = req.body;
        data.dateCreated = usersMethods.getNowDate();
        departmentDBs.updateOne(
            { _id: new ObjectId(req.params.id) },
            { "$set": data }
        )
        res.status(200).redirect('/admin/category/employee/department-list');
    } catch (err) {
        res.status(500).send({ err_mes: err.message });
    }
}

exports.deleteDepartment = async (req, res) => {
    const id = req.params.id;

    try {
        await client.connect();
        await departmentDBs.deleteOne({ _id: new ObjectId(id) });
        res.end();
    } catch (err) {
        res.status(404).send({ mes: err.message });
    }
}

exports.addSalary = async (req, res) => {
    await client.connect();
    const [employee_code, name, position, salary_per_day, employee_type, multipleSalaryOfET, degree,
        multipleSalaryOfDG, department, multipleSalaryOfDepartment] = req.body.employee.split("-");
    const prevData = usersMethods.createErrorString(req.body);
    await contractDBs.findOne({ employee_code: employee_code })
        .then(async (contractOfEmployee) => {
            const dateCreated = usersMethods.getNowDate();
            const negotiableRatio = Number.parseInt(contractOfEmployee.negotiableRatio);

            const realSalary = ((req.body.totalDays - req.body.dayOff) * salary_per_day * multipleSalaryOfET
                * multipleSalaryOfDepartment
                * multipleSalaryOfDG
                + Number.parseInt(req.body.allowance)
                + Number.parseInt(req.body.bonusSalary)
                - Number.parseInt(req.body.advanceSalary)) * (negotiableRatio / 100);

            const tax_type = contractOfEmployee.tax_type.toUpperCase().trim();
            let result = 0;

            if (tax_type == "THUẾ LUỸ TIẾN") {
                let discount = {
                    default: 11000000,
                    dependentMembers: 0
                };
                let remainingSalary = (realSalary - discount.default) / 1000000 + discount.dependentMembers * 4.4;
                let negotiableTax = 0;

                if (remainingSalary <= 5) negotiableTax = 0.05;
                else if (5 < remainingSalary <= 10) negotiableTax = 0.1;
                else if (10 < remainingSalary <= 18) negotiableTax = 0.15;
                else if (18 < remainingSalary <= 32) negotiableTax = 0.2;
                else if (32 < remainingSalary <= 52) negotiableTax = 0.25;
                else if (52 < remainingSalary <= 80) negotiableTax = 0.3;
                else negotiableTax = 0.35;

                result = remainingSalary * 1000000 * (1 - negotiableTax) + discount.default;
            }
            else if (tax_type == "THUẾ 10%") result = realSalary * 0.9;
            else if (tax_type == "KHÔNG ĐÓNG THUẾ") result = realSalary;
            else if (tax_type == "THUẾ 20%") result = realSalary * 0.8;

            result -= (Number.parseInt(contractOfEmployee.insuranceFee)
                    + Number.parseInt(contractOfEmployee.internalFund)
                    + Number.parseInt(contractOfEmployee.unionFee));

            let filter = { employee_code: employee_code };
            let update = {
                "$set": {
                    employee_code: employee_code,
                    name: name,
                    department: department,
                    position: position,
                },
                "$push": {
                    salaryList: {
                        dateCreated: dateCreated,
                        totalDays: req.body.totalDays,
                        dayOff: req.body.dayOff,
                        allowance: req.body.allowance,
                        advanceSalary: req.body.advanceSalary,
                        bonusSalary: req.body.bonusSalary,
                        realSalary: result,
                    }
                }
            }

            await Salary.findOneAndUpdate(filter, update, {
                new: true,
                upsert: true
            })
                .then(data => {
                    if (req.params.id) {
                        res.redirect('/admin/category/salary/view-salary/' + req.params.id);
                    } else {
                        res.redirect('/admin/category/salary/salary-list');
                    }
                })
                .catch(err => {
                    res.status(500).send({ mes: err.message });
                })
        })
        .catch(err => {
            res.redirect('/admin/category/salary/add-salary?error=err_employee_code' + prevData);
        })

}

exports.deleteSalaryOfEmployee = async (req, res) => {
    const salaryId = req.params.id;
    const employeeId = req.params.employeeId;
    try {
        await client.connect();
        const employee = await salaryDBs.findOne({ _id: new ObjectId(employeeId) });
        const salaryList = employee.salaryList;
        const newSalaryList = salaryList.filter(object => {
            if (object._id.toString() != salaryId) {
                return object;
            }
        }) || [];
        await salaryDBs.updateOne(
            { _id: new ObjectId(employeeId) },
            { "$set": { salaryList: newSalaryList } }
        );
        res.end();
    } catch (err) {
        res.status(404).send({ mes: err.message });
    }
}

exports.deleteSalary = async (req, res) => {
    const id = req.params.id;
    try {
        await client.connect();
        await salaryDBs.deleteOne({ _id: new ObjectId(id) });
        res.end();
    } catch (err) {
        res.status(404).send({ mes: err.message });
    }
}

exports.addBussiness = async (req, res) => {
    await client.connect();
    const [employee_code, name] = req.body.employee.split("-");
    const prevData = usersMethods.createErrorString(req.body);

    const dateCreated = usersMethods.getNowDate();
    const bussiness_code = usersMethods.getRandomBussinessCode();

    const bussiness = new Bussiness({
        bussiness_code: bussiness_code,
        bussiness: req.body.bussiness,
        employee_code: employee_code,
        name: name,
        startingDate: req.body.startingDate,
        endingDate: req.body.endingDate,
        location: req.body.location,
        purpose: req.body.purpose,
        dateCreated: dateCreated
    })

    await bussiness.save(bussiness)
        .then(data => {
            res.status(200).redirect('/admin/category/bussiness/bussiness-list');
        })
        .catch(err => {
            res.redirect('/admin/category/bussiness/add-bussiness?error=' + encodeURIComponent(`error_${Object.keys(err.keyValue)[0]}`) + prevData);
        })
}

exports.deleteBussiness = async (req, res) => {
    const id = req.params.id;
    try {
        await client.connect();
        await bussinessDBs.deleteOne({ _id: new ObjectId(id) });
        res.end();
    } catch (err) {
        res.status(404).send({ mes: err.message });
    }
}

exports.updateBussiness = async (req, res) => {
    try {
        await client.connect();
        const data = req.body;
        delete data.employee;

        bussinessDBs.updateOne(
            { _id: new ObjectId(req.params.id) },
            { "$set": data }
        )
        res.status(200).redirect('/admin/category/bussiness/bussiness-list');
    } catch (err) {
        res.status(500).send({ err_mes: err.message });
    }
}

exports.addGroup = async (req, res) => {
    await client.connect();
    const [department, employee_code, name, position, technique, avatar_url] = req.body.employee.split("-");
    const prevData = usersMethods.createErrorString(req.body);

    const dateCreated = usersMethods.getNowDate();
    const group_code = usersMethods.getRandomGroupCode();

    const group = new Group({
        group_code: group_code,
        group: req.body.group,
        employee_list: [
            {
                department: department,
                roles: "Trưởng nhóm",
                employee_code: employee_code,
                name: name,
                position: position,
                technique: technique,
                avatar_url: avatar_url,
                dateCreated: dateCreated
            }
        ],
        description: req.body.description,
        dateCreated: dateCreated
    })

    await group.save(group)
        .then(data => {
            res.status(200).redirect('/admin/category/group/group-list');
        })
        .catch(err => {
            res.redirect('/admin/category/group/add-group?error=' + encodeURIComponent(`error_${Object.keys(err.keyValue)[0]}`) + prevData);
        })
}

exports.updateGroup = async (req, res) => {
    await client.connect();
    const [department, employee_code, name, position, technique, avatar_url] = req.body.employee.split("-");
    const dateCreated = usersMethods.getNowDate();

    const specifiedGroup = await groupDBs.findOne({ _id: new ObjectId(req.params.id) });
    const employee_list = specifiedGroup.employee_list;
    const newEmployee_list = [], prevData = req.body;
    let oldLeaderIndex = null, notFoundEmloyeeInGroup = true;

    for (let index in employee_list) {
        if (employee_list[index].employee_code == employee_code) {
            notFoundEmloyeeInGroup = false;
            if (employee_list[index].roles == "Trưởng nhóm") newEmployee_list.push(employee_list[index]);
            else {
                employee_list[index].roles = "Trưởng nhóm";
                newEmployee_list.push(employee_list[index]);
            }
        } else {
            if (employee_list[index].roles == "Trưởng nhóm") oldLeaderIndex = index;
            newEmployee_list.push(employee_list[index]);
            if (oldLeaderIndex != null) newEmployee_list[oldLeaderIndex].roles = "Thành viên";
        }
    }

    if (notFoundEmloyeeInGroup) {
        newEmployee_list.map(object => {
            if (object.roles == "Trưởng nhóm") object.roles = "Thành viên";
            return object;
        })
        newEmployee_list.unshift({
            employee_code: employee_code,
            roles: "Trưởng nhóm",
            avatar_url: avatar_url,
            name: name,
            department: department,
            position: position,
            technique: technique,
            dateCreated: dateCreated,
        })
    }
    const update = {
        "$set": {
            group: req.body.group,
            description: req.body.description,
            dateCreated: dateCreated,
            employee_list: newEmployee_list
        }
    };

    await Group.findOneAndUpdate({ _id: new ObjectId(req.params.id) }, update)
        .then(data => {
            res.status(200).redirect('/admin/category/group/view-group/' + req.params.id);
        })
        .catch(err => {
            res.redirect('/admin/category/group/update-group/' + req.params.id
                + '?error=' + encodeURIComponent(`error_${Object.keys(err.keyValue)[0]}`) + prevData);
        })
}

exports.deleteGroup = async (req, res) => {
    const id = req.params.id;
    try {
        await client.connect();
        await groupDBs.deleteOne({ _id: new ObjectId(id) });
        res.end();
    } catch (err) {
        res.status(404).send({ mes: err.message });
    }
}

exports.addEmployeeIntoGroup = async (req, res) => {
    await client.connect();
    const [employee_code, technique] = req.body.employee.split("-");
    const user = await userDBs.findOne({ employee_code: employee_code });;
    const existedUser = await groupDBs.findOne({ employee_list: { "$elemMatch": { employee_code: employee_code } } });

    if (existedUser) {
        res.redirect('/admin/category/group/add-employee-into-group/' + req.params.id + '?error=employee_code');
    } else {
        const update = {
            "$push": {
                employee_list: {
                    employee_code: employee_code,
                    roles: "Thành viên",
                    avatar_url: user.avatar_url,
                    name: user.name,
                    department: user.department,
                    position: user.position,
                    technique: technique,
                    dateCreated: usersMethods.getNowDate()
                }
            }
        };
        await Group.findOneAndUpdate({ _id: new ObjectId(req.params.id) }, update)
            .then(data => {
                res.status(200).redirect('/admin/category/group/view-group/' + req.params.id);
            })
    }
}

exports.deleteEmployeeIntoGroup = async (req, res) => {
    const id = req.params.id;
    const group_id = req.params.group_id;

    try {
        await client.connect();
        const group = await groupDBs.findOne({ _id: new ObjectId(group_id) });
        const employee_list = group.employee_list;
        const newEmployee_list = employee_list.filter(object => {
            if (object._id.toString() != id) {
                return object;
            }
        }) || [];

        await groupDBs.updateOne(
            { _id: new ObjectId(group_id) },
            { "$set": { employee_list: newEmployee_list } }
        );
        res.end();
    } catch (err) {
        res.status(404).send({ mes: err.message });
    }
}

exports.addComplimentType = async (req, res) => {
    await client.connect();
    const prevData = usersMethods.createErrorString(req.body);

    const dateCreated = usersMethods.getNowDate();
    const compliment_type_code = usersMethods.getRandomComplimentTypeCode();

    const compliment_type = new Compliment_type({
        compliment_type_code: compliment_type_code,
        compliment_type: req.body.compliment_type,
        description: req.body.description,
        dateCreated: dateCreated
    })

    await compliment_type.save(compliment_type)
        .then(data => {
            res.status(200).redirect('/admin/category/compliment/compliment-type');
        })
        .catch(err => {
            res.redirect('/admin/category/compliment/add-compliment-type?error=' + encodeURIComponent(`error_${Object.keys(err.keyValue)[0]}`) + prevData);
        })
}

exports.deleteComplimentType = async (req, res) => {
    const id = req.params.id;
    try {
        await client.connect();
        await compliment_typeDBs.deleteOne({ _id: new ObjectId(id) });
        res.end();
    } catch (err) {
        res.status(404).send({ mes: err.message });
    }
}

exports.updateComplimentType = async (req, res) => {
    try {
        await client.connect();
        const data = req.body;
        data.dateCreated = usersMethods.getNowDate();

        compliment_typeDBs.updateOne(
            { _id: new ObjectId(req.params.id) },
            { "$set": data }
        )
        res.status(200).redirect('/admin/category/compliment/compliment-type');
    } catch (err) {
        res.status(500).send({ err_mes: err.message });
    }
}

exports.addEmployeeCompliment = async (req, res) => {
    await client.connect();
    const [department, employee_code, name] = req.body.employee.split("-");
    const dateCreated = req.body.dateCreated;
    const [compliment_type_code, compliment_type] = req.body.compliment_type.split("-");
    const compliment_code = usersMethods.getRandomComplimentCode();
    const prevData = usersMethods.createErrorString(req.body);
    let filter = { employee_code: employee_code };

    let update = {
        "$set": {
            name: name,
            employee_code: employee_code,
            department: department,
        },
        "$push": {
            compliments_list: {
                compliment_code: compliment_code,
                compliment: req.body.compliment,
                numbers: req.body.numbers,
                compliment_type: compliment_type,
                description: req.body.description,
                dateCreated: dateCreated,
            }
        }
    }

    const existCompliment =
        await employee_complimentsDBs.findOne({
            employee_code: employee_code,
            compliments_list: { "$elemMatch": { compliment_type: compliment_type, dateCreated: dateCreated, } }
        });
    if (existCompliment) {
        res.redirect('/admin/category/compliment/add-employee-compliment?error=compliment_code' + prevData);
    } else {
        await Employee_compliments.findOneAndUpdate(filter, update, {
            new: true,
            upsert: true
        })
            .then(data => {
                if (req.params.id) {
                    res.redirect('/admin/category/compliment/view-employee-compliments/' + req.params.id);
                } else {
                    res.redirect('/admin/category/compliment/employee-compliments-list');
                }
            })
            .catch(err => {
                res.status(500).send({ mes: err.message });
            })
    }
}

exports.deleteEmployeeCompliment = async (req, res) => {
    const id = req.params.id;
    try {
        await client.connect();
        await employee_complimentsDBs.deleteOne({ _id: new ObjectId(id) });
        res.end();
    } catch (err) {
        res.status(404).send({ mes: err.message });
    }
}

exports.updateEmployeeCompliment = async (req, res) => {
    await client.connect();
    const updatedComplimentCode = req.params.complimentCode;
    const dateCreated = usersMethods.getNowDate();
    const [compliment_type_code, compliment_type] = req.body.compliment_type.split("-");
    let filter = { "compliments_list.compliment_code": updatedComplimentCode };

    let update = {
        "$set": {
            "compliments_list.$.compliment_code": updatedComplimentCode,
            "compliments_list.$.compliment": req.body.compliment,
            "compliments_list.$.numbers": req.body.numbers,
            "compliments_list.$.compliment_type": compliment_type,
            "compliments_list.$.description": req.body.description,
            "compliments_list.$.dateCreated": dateCreated,
        }
    }

    await Employee_compliments.findOneAndUpdate(filter, update)
        .then(data => {
            res.redirect('/admin/category/compliment/view-employee-compliments/' + data._id.toString());
        })
        .catch(err => {
            res.status(500).send({ mes: err.message });
        })
}

exports.deleteComplimentOfEmployee = async (req, res) => {
    const complimentId = req.params.id;
    const employeeId = req.params.employeeId;
    try {
        await client.connect();
        const employee = await employee_complimentsDBs.findOne({ _id: new ObjectId(employeeId) });
        const compliments_list = employee.compliments_list;
        const newCompliments_list = compliments_list.filter(object => {
            if (object._id.toString() != complimentId) {
                return object;
            }
        }) || [];

        await employee_complimentsDBs.updateOne(
            { _id: new ObjectId(employeeId) },
            { "$set": { compliments_list: newCompliments_list } }
        );
        res.end();
    } catch (err) {
        res.status(404).send({ mes: err.message });
    }
}

exports.addGroupCompliment = async (req, res) => {
    await client.connect();
    const [group_code, group] = req.body.group.split("-");
    const [compliment_type_code, compliment_type] = req.body.compliment_type.split("-");
    const compliment_code = usersMethods.getRandomComplimentCode();
    console.log(compliment_code);
    const dateCreated = req.body.dateCreated;

    const prevData = usersMethods.createErrorString(req.body);
    let filter = { group_code: group_code };

    let update = {
        "$set": {
            group_code: group_code,
            group: group
        },
        "$push": {
            compliments_list: {
                compliment_code: compliment_code,
                compliment: req.body.compliment,
                numbers: req.body.numbers,
                compliment_type: compliment_type,
                description: req.body.description,
                dateCreated: dateCreated,
            }
        }
    }

    const existCompliment =
        await group_complimentsDBs.findOne({
            group_code: group_code,
            compliments_list: { "$elemMatch": { compliment_type: compliment_type, dateCreated: dateCreated, } }
        });
    if (existCompliment) {
        res.redirect('/admin/category/compliment/add-group-compliment?error=compliment_code' + prevData);
    } else {
        await Group_compliments.findOneAndUpdate(filter, update, {
            new: true,
            upsert: true
        })
            .then(data => {
                if (req.params.id) {
                    res.redirect('/admin/category/compliment/view-group-compliments/' + req.params.id);
                } else {
                    res.redirect('/admin/category/compliment/group-compliments-list');
                }
            })
            .catch(err => {
                res.status(500).send({ mes: err.message });
            })
    }
}

exports.updateGroupCompliment = async (req, res) => {
    await client.connect();
    const updatedComplimentCode = req.params.complimentCode;
    const dateCreated = usersMethods.getNowDate();
    const [compliment_type_code, compliment_type] = req.body.compliment_type.split("-");
    let filter = { "compliments_list.compliment_code": updatedComplimentCode };

    let update = {
        "$set": {
            "compliments_list.$.compliment_code": updatedComplimentCode,
            "compliments_list.$.compliment": req.body.compliment,
            "compliments_list.$.numbers": req.body.numbers,
            "compliments_list.$.compliment_type": compliment_type,
            "compliments_list.$.description": req.body.description,
            "compliments_list.$.dateCreated": dateCreated,
        }
    }

    await Group_compliments.findOneAndUpdate(filter, update)
        .then(data => {
            res.redirect('/admin/category/compliment/view-group-compliments/' + data._id.toString());
        })
        .catch(err => {
            res.status(500).send({ mes: err.message });
        })
}

exports.deleteComplimentOfGroup = async (req, res) => {
    const complimentId = req.params.id;
    const groupId = req.params.groupId;

    try {
        await client.connect();
        const group = await group_complimentsDBs.findOne({ _id: new ObjectId(groupId) });
        const compliments_list = group.compliments_list;
        const newCompliments_list = compliments_list.filter(object => {
            if (object._id.toString() != complimentId) {
                return object;
            }
        }) || [];

        await group_complimentsDBs.updateOne(
            { _id: new ObjectId(groupId) },
            { "$set": { compliments_list: newCompliments_list } }
        );
        res.end();
    } catch (err) {
        res.status(404).send({ mes: err.message });
    }
}

exports.deleteGroupCompliment = async (req, res) => {
    const id = req.params.id;
    try {
        await client.connect();
        await group_complimentsDBs.deleteOne({ _id: new ObjectId(id) });
        res.end();
    } catch (err) {
        res.status(404).send({ mes: err.message });
    }
}

exports.addDisciplineType = async (req, res) => {
    await client.connect();
    const prevData = usersMethods.createErrorString(req.body);

    const dateCreated = usersMethods.getNowDate();
    const discipline_type_code = usersMethods.getRandomDisciplineTypeCode();

    const discipline_type = new Discipline_type({
        discipline_type_code: discipline_type_code,
        discipline_type: req.body.discipline_type,
        description: req.body.description,
        dateCreated: dateCreated
    })

    await discipline_type.save(discipline_type)
        .then(data => {
            res.status(200).redirect('/admin/category/discipline/discipline-type');
        })
        .catch(err => {
            res.redirect('/admin/category/discipline/add-discipline-type?error=' + encodeURIComponent(`error_${Object.keys(err.keyValue)[0]}`) + prevData);
        })
}

exports.deleteDisciplineType = async (req, res) => {
    const id = req.params.id;
    try {
        await client.connect();
        await discipline_typeDBs.deleteOne({ _id: new ObjectId(id) });
        res.end();
    } catch (err) {
        res.status(404).send({ mes: err.message });
    }
}

exports.updateDisciplineType = async (req, res) => {
    try {
        await client.connect();
        const data = req.body;
        data.dateCreated = usersMethods.getNowDate();

        discipline_typeDBs.updateOne(
            { _id: new ObjectId(req.params.id) },
            { "$set": data }
        )
        res.status(200).redirect('/admin/category/discipline/discipline-type');
    } catch (err) {
        res.status(500).send({ err_mes: err.message });
    }
}

exports.addEmployeeDiscipline = async (req, res) => {
    await client.connect();
    const [department, employee_code, name] = req.body.employee.split("-");
    const dateCreated = usersMethods.getNowDate();
    const [discipline_type_code, discipline_type] = req.body.discipline_type.split("-");
    const discipline_code = usersMethods.getRandomDisciplineCode();
    const prevData = usersMethods.createErrorString(req.body);
    let filter = { employee_code: employee_code };

    let update = {
        "$set": {
            name: name,
            employee_code: employee_code,
            department: department,
        },
        "$push": {
            discipline_list: {
                discipline_code: discipline_code,
                discipline: req.body.discipline,
                numbers: req.body.numbers,
                discipline_type: discipline_type,
                description: req.body.description,
                dateCreated: dateCreated,
            }
        }
    }
    await Employee_discipline.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true
    })
        .then(data => {
            if (req.params.id) {
                res.redirect('/admin/category/discipline/view-employee-discipline/' + req.params.id);
            } else {
                res.redirect('/admin/category/discipline/employee-discipline-list');
            }
        })
        .catch(err => {
            res.status(500).send({ mes: err.message });
        })
}

exports.deleteEmployeeDiscipline = async (req, res) => {
    const id = req.params.id;
    try {
        await client.connect();
        await employee_disciplineDBs.deleteOne({ _id: new ObjectId(id) });
        res.end();
    } catch (err) {
        res.status(404).send({ mes: err.message });
    }
}

exports.updateEmployeeDiscipline = async (req, res) => {
    await client.connect();
    const updatedDisciplineCode = req.params.disciplineCode;
    const dateCreated = usersMethods.getNowDate();
    const [discipline_type_code, discipline_type] = req.body.discipline_type.split("-");
    let filter = { "discipline_list.discipline_code": updatedDisciplineCode };

    let update = {
        "$set": {
            "discipline_list.$.discipline_code": updatedDisciplineCode,
            "discipline_list.$.discipline": req.body.discipline,
            "discipline_list.$.numbers": req.body.numbers,
            "discipline_list.$.discipline_type": discipline_type,
            "discipline_list.$.description": req.body.description,
            "discipline_list.$.dateCreated": dateCreated,
        }
    }

    await Employee_discipline.findOneAndUpdate(filter, update)
        .then(data => {
            res.redirect('/admin/category/discipline/view-employee-discipline/' + data._id.toString());
        })
        .catch(err => {
            res.status(500).send({ mes: err.message });
        })
}

exports.deleteDisciplineOfEmployee = async (req, res) => {
    const disciplineId = req.params.id;
    const employeeId = req.params.employeeId;
    try {
        await client.connect();
        const employee = await employee_disciplineDBs.findOne({ _id: new ObjectId(employeeId) });
        const discipline_list = employee.discipline_list;
        const newDiscipline_list = discipline_list.filter(object => {
            if (object._id.toString() != disciplineId) {
                return object;
            }
        }) || [];

        await employee_disciplineDBs.updateOne(
            { _id: new ObjectId(employeeId) },
            { "$set": { discipline_list: newDiscipline_list } }
        );
        res.end();
    } catch (err) {
        res.status(404).send({ mes: err.message });
    }
}

exports.addGroupDiscipline = async (req, res) => {
    await client.connect();
    const [group_code, group] = req.body.group.split("-");
    const [discipline_type_code, discipline_type] = req.body.discipline_type.split("-");
    const discipline_code = usersMethods.getRandomDisciplineCode();
    console.log(discipline_code);
    const dateCreated = usersMethods.getNowDate();

    const prevData = usersMethods.createErrorString(req.body);
    let filter = { group_code: group_code };

    let update = {
        "$set": {
            group_code: group_code,
            group: group
        },
        "$push": {
            discipline_list: {
                discipline_code: discipline_code,
                discipline: req.body.discipline,
                numbers: req.body.numbers,
                discipline_type: discipline_type,
                description: req.body.description,
                dateCreated: dateCreated,
            }
        }
    }

    await Group_discipline.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true
    })
        .then(data => {
            if (req.params.id) {
                res.redirect('/admin/category/discipline/view-group-discipline/' + req.params.id);
            } else {
                res.redirect('/admin/category/discipline/group-discipline-list');
            }
        })
        .catch(err => {
            res.status(500).send({ mes: err.message });
        })
}

exports.updateGroupDiscipline = async (req, res) => {
    await client.connect();
    const updatedDisciplineCode = req.params.disciplineCode;
    const dateCreated = usersMethods.getNowDate();
    const [discipline_type_code, discipline_type] = req.body.discipline_type.split("-");
    let filter = { "discipline_list.discipline_code": updatedDisciplineCode };

    let update = {
        "$set": {
            "discipline_list.$.discipline_code": updatedDisciplineCode,
            "discipline_list.$.discipline": req.body.discipline,
            "discipline_list.$.numbers": req.body.numbers,
            "discipline_list.$.discipline_type": discipline_type,
            "discipline_list.$.description": req.body.description,
            "discipline_list.$.dateCreated": dateCreated,
        }
    }

    await Group_discipline.findOneAndUpdate(filter, update)
        .then(data => {
            res.redirect('/admin/category/discipline/view-group-discipline/' + data._id.toString());
        })
        .catch(err => {
            res.status(500).send({ mes: err.message });
        })
}

exports.deleteDisciplineOfGroup = async (req, res) => {
    const disciplineId = req.params.id;
    const groupId = req.params.groupId;

    try {
        await client.connect();
        const group = await group_disciplineDBs.findOne({ _id: new ObjectId(groupId) });
        const discipline_list = group.discipline_list;
        const newDiscipline_list = discipline_list.filter(object => {
            if (object._id.toString() != disciplineId) {
                return object;
            }
        }) || [];

        await group_disciplineDBs.updateOne(
            { _id: new ObjectId(groupId) },
            { "$set": { discipline_list: newDiscipline_list } }
        );
        res.end();
    } catch (err) {
        res.status(404).send({ mes: err.message });
    }
}

exports.deleteGroupDiscipline = async (req, res) => {
    const id = req.params.id;
    try {
        await client.connect();
        await group_disciplineDBs.deleteOne({ _id: new ObjectId(id) });
        res.end();
    } catch (err) {
        res.status(404).send({ mes: err.message });
    }
}

exports.addInsurance = async (req, res) => {
    await client.connect();
    const inputData = req.body;
    const prevData = usersMethods.createErrorString(req.body);
    const splitedArray = inputData.employee.split("-");

    delete inputData.employee;
    const remaindingData = {
        employee_code: splitedArray[0],
        name: splitedArray[1],
        insurance_code: usersMethods.getRandomInsuranceCode(),
        dateCreated: usersMethods.getNowDate()
    }
    const result = Object.assign(inputData, remaindingData);
    const insurance = new Insurance(result);
    console.log(insurance);

    await insurance.save(insurance)
        .then(data => {
            res.status(200).redirect('/admin/category/insurance/insurance-list');
        })
        .catch(err => {
            res.redirect('/admin/category/insurance/add-insurance?error=' + encodeURIComponent(`error_${Object.keys(err.keyValue)[0]}`) + prevData);
        });
}

exports.updateInsurance = async (req, res) => {
    try {
        await client.connect();
        const data = req.body;
        data.dateCreated = usersMethods.getNowDate();

        insuranceDBs.updateOne(
            { _id: new ObjectId(req.params.id) },
            { "$set": data }
        )
        res.status(200).redirect('/admin/category/insurance/view-insurance/' + req.params.id);
    } catch (err) {
        res.status(500).send({ err_mes: err.message });
    }
}

exports.deleteInsurance = async (req, res) => {
    const id = req.params.id;
    try {
        await client.connect();
        await insuranceDBs.deleteOne({ _id: new ObjectId(id) });
        res.end();
    } catch (err) {
        res.status(404).send({ mes: err.message });
    }
}

exports.addContractType = async (req, res) => {
    await client.connect();
    const prevData = usersMethods.createErrorString(req.body);

    const dateCreated = usersMethods.getNowDate();
    const contract_type_code = usersMethods.getRandomContractTypeCode();

    const contract_type = new Contract_type({
        contract_type_code: contract_type_code,
        contract_type: req.body.contract_type,
        description: req.body.description,
        dateCreated: dateCreated
    })

    await contract_type.save(contract_type)
        .then(data => {
            res.status(200).redirect('/admin/category/contract/contract-type');
        })
        .catch(err => {
            res.redirect('/admin/category/contract/add-contract-type?error=' + encodeURIComponent(`error_${Object.keys(err.keyValue)[0]}`) + prevData);
        })
}

exports.updateContractType = async (req, res) => {
    try {
        await client.connect();
        const data = req.body;
        data.dateCreated = usersMethods.getNowDate();

        contract_typeDBs.updateOne(
            { _id: new ObjectId(req.params.id) },
            { "$set": data }
        )
        res.status(200).redirect('/admin/category/contract/contract-type');
    } catch (err) {
        res.status(500).send({ err_mes: err.message });
    }
}

exports.deleteContractType = async (req, res) => {
    const id = req.params.id;
    try {
        await client.connect();
        await contract_typeDBs.deleteOne({ _id: new ObjectId(id) });
        res.end();
    } catch (err) {
        res.status(404).send({ mes: err.message });
    }
}

exports.addContract = async (req, res) => {
    await client.connect();
    const inputData = req.body;
    const prevData = usersMethods.createErrorString(req.body);
    const employeeData = inputData.employee.split("-");

    const remainingEmployeeData = {
        contract_code: usersMethods.getRandomContractCode(),
        employee_code: employeeData.shift(),
        name: employeeData.shift(),
        dateCreated: usersMethods.getNowDate(),
    }
    const result = Object.assign(inputData, remainingEmployeeData);
    const contract = new Contract(result);

    await contract.save(contract)
        .then(data => {
            res.status(200).redirect('/admin/category/contract/contract-list');
        })
        .catch(err => {
            res.redirect('/admin/category/contract/add-contract?error=' + encodeURIComponent(`error_${Object.keys(err.keyValue)[0]}`) + prevData);
        })
}

exports.deleteContract = async (req, res) => {
    const id = req.params.id;
    try {
        await client.connect();
        await contractDBs.deleteOne({ _id: new ObjectId(id) });
        res.end();
    } catch (err) {
        res.status(404).send({ mes: err.message });
    }
}

exports.updateContract = async (req, res) => {
    try {
        await client.connect();
        const data = req.body;
        data.dateCreated = usersMethods.getNowDate();

        contractDBs.updateOne(
            { _id: new ObjectId(req.params.id) },
            { "$set": data }
        )
        res.status(200).redirect('/admin/category/contract/view-contract/' + req.params.id);
    } catch (err) {
        res.status(500).send({ err_mes: err.message });
    }
}

exports.reportApplication = async (req, res) => {
    await client.connect();
    const admin = await userDBs.findOne({ admin: 1 });
    const sendingMailOptions = {
        body: admin.account,
        subject: "Reporting HR Management Website",
        html: `<div>
                <p style="font-size:15px"><b>Tên nhân viên</b>: <i>${req.body.name}</i></p>
                <p style="font-size:15px"><b>Email</b>: <i>${req.body.email}</i></p>
                <p style="font-size: 14px;"><b>Nội dung</b>: ${req.body.details}</p>
            </div>`,
        flexibleOptions: {
            type: null,
        }
    };
    await usersMethods.sendingMail(sendingMailOptions)
        .then(result => {
            res.status(200).send({ result: result, sent: true });
        })
        .catch(err => {
            res.status(500).send({ err_mess: err.message });
        })
}

exports.changePassword = async (req, res) => {
    await client.connect();
    const prevData = usersMethods.createErrorString(req.body);
    await userDBs.findOne({ "account.email": req.body.email })
        .then(async (userFound) => {
            const isMatchedPassword = bcrypt.compareSync(req.body["old-password"], userFound.account.password);
            if (isMatchedPassword) {
                await userDBs.updateOne(
                    { "account.email": req.body.email },
                    {
                        "$set": {
                            "account.password": usersMethods.getHasedPassword(req.body["new-password"])
                        }
                    }
                )
                    .then(result => res.redirect('/change-password?successfully=true'))
                    .catch(err => res.status(500).send({ err_message: err.message }))
            } else {
                res.redirect('/change-password?error=' + encodeURIComponent(`error_old-password`) + prevData)
            }
        })

}