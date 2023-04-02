const UserDb = require('./users.model');
const authMethods = require('../auth/auth.methods');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const path = require('path');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const sharp = require('sharp');
const bcrypt = require('bcrypt');

const client = new MongoClient(process.env.MONGO_URI);
const userDBs = client.db('company').collection('userdbs');
const DOMAIN = process.env.DOMAIN;
const usersMethods = require('./users.methods');

(async function() { await client.connect() })();

exports.addEmployee = async (req, res) => {
    if (!req.body) res.status(400).send({ message: "Content can not be empty!" }).end();

    const user_id = usersMethods.getRandomUserId(req.body.identifier);
    const prevData = usersMethods.createErrorString(req.body);
    const password = usersMethods.getRandomUserPassword();
    const hasedPassword = usersMethods.getHasedPassword(password);
    const employee_code = usersMethods.getRandomEmployeeCode();

    const user = new UserDb({
        id: user_id,
        admin: 0,
        employee_code: employee_code,
        name: req.body.name,
        avatar_url: "",
        account: {
            email: req.body.email,
            password: hasedPassword,
        },
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

    user.save(user)
        .then(async (data) => {
            sharp(req.file.path)
                .resize({ height: 350 })
                .toBuffer(async (err, buffer) => {
                    try {
                        const stream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, async (err, result) => {
                            if (!err) {
                                await userDBs.updateOne({ id: user_id }, { "$set": { avatar_url: result.url } })
                                await usersMethods.sendingMail(sendingMailOptions);
                                res.redirect('/home/' + user_id);
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
            res.redirect(DOMAIN + '/add-employee?error=' + encodeURIComponent(`error_${Object.keys(err.keyValue)[0]}`) + prevData);
        })
}
exports.login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const hasedPassword = usersMethods.getHasedPassword(password);
    const prevData = '?email=' + email + '?password=';

    await client.connect();
    const user = await userDBs.findOne({ "account.email": email });

    const accessToken = authMethods.generateAccessToken({ name: user.name, admin: user.admin });
    let refreshToken = authMethods.generateRefreshToken({ name: user.name, admin: user.admin });

    if (!user.refreshToken) {
        await userDBs.updateOne({ "account.email": email }, { "$set": { "tokens.refreshToken": refreshToken } });
    } else {
        refreshToken = user.refreshToken;
    }

    if (user) {
        bcrypt.compare(password, user.account.password, function (err, isValid) {
            if (isValid) {
                res.cookie('name', user.name)
                        .cookie('accessToken', accessToken, { httpOnly: true })
                        .cookie('refreshToken', refreshToken, { httpOnly: true })
                        .cookie('admin', user.admin)
                        .redirect('/home/' + user.id);
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
                updateNewPassword: async function(email, newHasedPassword) {
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
