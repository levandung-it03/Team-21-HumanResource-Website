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
const positionDBs = client.db('company').collection('position');
const bussinessDBs = client.db('company').collection('bussiness');
const techniqueDBs = client.db('company').collection('technique');
const departmentDBs = client.db('company').collection('department');
const employee_typeDBs = client.db('company').collection('employee_type');

const usersMethods = require('./users.methods');
const authMethods = require('../auth/auth.methods');
const { UserDb, Salary, Position, Degree, Department, Employee_type, Technique, Bussiness, Group, Compliment_type,
Employee_compliments, Group_compliments } = require('./users.model');

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
            res.redirect(DOMAIN + '/admin/category/employee/add-employee?error=' + encodeURIComponent(`error_${Object.keys(err.keyValue)[0]}`) + prevData);
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
        await userDBs.updateOne({ "account.email": email }, { "$set": { "tokens.refreshToken": refreshToken } });
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
                    .redirect('/home');
            } else {
                res.redirect(DOMAIN + '/login?error=' + encodeURIComponent('error_password') + prevData);
            }
        })
    } else {
        res.redirect(DOMAIN + '/login?error=' + encodeURIComponent('error_email') + prevData);
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

    await userDBs.updateOne({ _id: new ObjectId(id) }, { "$set": userdb })
        .then(async (result) => {
            const public_id = usersMethods.getPublicIdByImageURL(user.avatar_url);
            try {
                await techniqueDBs.updateOne({ employee_code: user.employee_code }, { "$set": { department: req.body.department } });
                sharp(req.file.path)
                    .resize({ height: 350 })
                    .toBuffer(async (err, buffer) => {
                        try {
                            const stream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, async (err, result) => {
                                if (!err) {
                                    await userDBs.updateOne({ _id: new ObjectId(id) }, { "$set": { avatar_url: result.url } });
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
            res.redirect(DOMAIN + '/admin/category/employee/employee-list/update/' + id + '?error=' + encodeURIComponent(`error_${Object.keys(err.keyValue)[0]}`) + prevData);

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
            res.redirect(DOMAIN + '/admin/category/employee/add-employee-type?error=' + encodeURIComponent(`error_${Object.keys(err.keyValue)[0]}`) + prevData);
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
            res.redirect(DOMAIN + '/admin/category/employee/add-degree?error=' + encodeURIComponent(`error_${Object.keys(err.keyValue)[0]}`) + prevData);
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
            res.redirect(DOMAIN + '/admin/category/employee/add-technique?error=' + encodeURIComponent(`error_${Object.keys(err.keyValue)[0]}`) + prevData);
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
            res.redirect(DOMAIN + '/admin/category/employee/add-position?error=' + encodeURIComponent(`error_${Object.keys(err.keyValue)[0]}`) + prevData);
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
            res.redirect(DOMAIN + '/admin/category/employee/add-department?error=' + encodeURIComponent(`error_${Object.keys(err.keyValue)[0]}`) + prevData);
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

    const dateCreated = usersMethods.getNowDate();
    const tax = 0;
    const realSalary = ((req.body.totalDays - req.body.dayOff) * salary_per_day * multipleSalaryOfET
        * multipleSalaryOfDepartment
        * multipleSalaryOfDG
        + Number.parseInt(req.body.allowance)
        + Number.parseInt(req.body.bonusSalary)
        - Number.parseInt(req.body.advanceSalary)) * (1 - tax);

    let filter = { employee_code: employee_code };

    let update = {
        "$set": {
            name: name,
            position: position,
            employee_type: employee_type,
            degree: degree,
            salary_per_day: salary_per_day,
            department: department,
        },
        "$push": {
            salaryList: {
                dateCreated: dateCreated,
                totalDays: req.body.totalDays,
                dayOff: req.body.dayOff,
                allowance: req.body.allowance,
                advanceSalaray: req.body.advanceSalaray,
                bonusSalary: req.body.bonusSalary,
                tax: tax,
                realSalary: realSalary,
            }
        }
    }
    await Salary.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true
    })
        .then(data => {
            res.redirect('/admin/category/salary/salary-list')
        })
        .catch(err => {
            res.status(500).send({ mes: err.message });
        })
}

exports.deleteSalary = async (req, res) => {
    const id = req.params.id;
    try {
        await client.connect();
        await salaryDBs.updateOne(
            { _id: new ObjectId(id) },
            { "$pop": { salaryList: 1 } }
        );
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
            res.redirect(DOMAIN + '/admin/category/bussiness/add-bussiness?error=' + encodeURIComponent(`error_${Object.keys(err.keyValue)[0]}`) + prevData);
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
            res.redirect(DOMAIN + '/admin/category/group/add-group?error=' + encodeURIComponent(`error_${Object.keys(err.keyValue)[0]}`) + prevData);
        })
}

exports.updateGroup = async (req, res) => {
    await client.connect();
    const [department, employee_code, name, position, technique, avatar_url] = req.body.employee.split("-");
    const dateCreated = usersMethods.getNowDate();

    const specifiedGroup = await groupDBs.findOne({ _id: new ObjectId(req.params.id) });
    const employee_list = specifiedGroup.employee_list;
    const newEmployee_list = [];
    let oldLeaderIndex = null, notFoundEmloyeeInGroup = true;

    for (let index in employee_list) {
        if (employee_list[index].employee_code == employee_code) {
            notFoundEmloyeeInGroup = false;
            if (employee_list[index].roles == "Trưởng nhóm")    newEmployee_list.push(employee_list[index]);
            else {
                employee_list[index].roles = "Trưởng nhóm";
                newEmployee_list.push(employee_list[index]);
            }
        } else {
            if (employee_list[index].roles == "Trưởng nhóm")    oldLeaderIndex = index;
            newEmployee_list.push(employee_list[index]);
            if (oldLeaderIndex != null)   newEmployee_list[oldLeaderIndex].roles = "Thành viên";
        }
    }

    if (notFoundEmloyeeInGroup) {
        newEmployee_list.map(object => {
            if (object.roles == "Trưởng nhóm")  object.roles = "Thành viên";
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
            res.status(404).send({ mes: err.message });
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
        res.redirect(DOMAIN + '/admin/category/group/add-employee-into-group/' + req.params.id + '?error=employee_code');
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
        });

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
            res.redirect(DOMAIN + '/admin/category/compliment/add-compliment-type?error=' + encodeURIComponent(`error_${Object.keys(err.keyValue)[0]}`) + prevData);
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
    const dateCreated = usersMethods.getNowDate();
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
        compliments_list: {"$elemMatch": {compliment_type: compliment_type, dateCreated: dateCreated,}}
    });
    if (existCompliment) {
        res.redirect(DOMAIN + '/admin/category/compliment/add-employee-compliment?error=compliment_code' + prevData);
    } else {
        await Employee_compliments.findOneAndUpdate(filter, update, {
            new: true,
            upsert: true
        })
            .then(data => {
                res.redirect('/admin/category/compliment/employee-compliments-list');
            })
            .catch(err => {
                res.status(500).send({ mes: err.message });
            })
    }
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
        });

        await employee_complimentsDBs.updateOne(
            { _id: new ObjectId(employeeId) },
            { "$set": { compliments_list: newCompliments_list } }
        );
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
            "compliments_list.$[]": {
                compliment_code: updatedComplimentCode,
                compliment: req.body.compliment,
                numbers: req.body.numbers,
                compliment_type: compliment_type,
                description: req.body.description,
                dateCreated: dateCreated,
            }
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