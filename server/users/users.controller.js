const { UserDb, Salary } = require('./users.model');
const authMethods = require('../auth/auth.methods');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const path = require('path');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const sharp = require('sharp');
const bcrypt = require('bcrypt');

const client = new MongoClient(process.env.MONGO_URI);
const userDBs = client.db('company').collection('userdbs');
const salaryDBs = client.db('company').collection('salary');
const DOMAIN = process.env.DOMAIN;
const usersMethods = require('./users.methods');

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
        dateCreated: Date.now(),
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

    const userdb = {
        admin: 0,
        name: req.body.name,
        account: {
            email: req.body.email,
            password: user.account.password
        },
        dateCreated: Date.now(),
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
        status: req.body.status,
    };

    const sendingMailOptions = {
        body: req.body,
        subject: "HR Management Website",
        html: `<div>
                <p style="font-size: 18px">Administrator của chúng tôi đã thay đổi thông tin của bạn! Hãy đăng nhập để biết thêm thông tin chi tiết!</p>
            </div>`,
        flexibleOptions: {
            type: null,
        }
    }

    try {
        await userDBs.updateOne({ _id: new ObjectId(id) }, { "$set": userdb })
            .then(async (result) => {
                await usersMethods.sendingMail(sendingMailOptions);
                const old_url = user.avatar_url;
                const public_id = old_url.split("/")[old_url.split("/").length - 1].split(".")[0];
                try {
                    await cloudinary.uploader.destroy(public_id);
                    sharp(req.file.path)
                        .resize({ height: 350 })
                        .toBuffer(async (err, buffer) => {
                            try {
                                const stream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, async (err, result) => {
                                    if (!err) {
                                        await userDBs.updateOne({ _id: new ObjectId(id) }, { "$set": { avatar_url: result.url } });
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
                res.status(500).send({ type: "update", mes: err.message });
            })
    } catch (err) {
        res.redirect(DOMAIN + '/admin/category/employee/add-employee?error=' + encodeURIComponent(`error_${Object.keys(err.keyValue)[0]}`) + prevData);
    }
}

exports.deleteEmployee = async (req, res) => {
    const id = req.params.id;
    await client.connect();
    await userDBs.deleteOne({ _id: new ObjectId(id) })
}