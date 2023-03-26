const UserDb = require('./users.model');
const authMethods = require('../auth/auth.methods');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const path = require('path');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const client = new MongoClient(process.env.MONGO_URI);
const userDBs = client.db('company').collection('userdbs');
const DOMAIN = process.env.DOMAIN;

(async function() {
    await client.connect();
})();

exports.register = async (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    const { name, identifier, birthday, email, password, errHiredDay, phone,
            department, position, gender } = req.body;
    
    const hiredDay = req.body['hired-day'], adminRight = req.body['admin-right'];

    const hashedPass = bcrypt.hashSync(password, 10);
    const prevData = '?identifier=' + identifier
        + '?name=' + name
        + '?birthday=' + birthday
        + '?email=' + email
        + '?password=' + password
        + '?hired-day=' + hiredDay
        + '?phone=' + phone
        + '?department=' + department
        + '?position=' + position
        + '?gender=' + gender;

    const user = new UserDb({
        identifier: identifier,
        name: name,
        birthday: birthday,
        account: {
            email: email,
            password: hashedPass,
        },
        admin: "0",
        hiredDay: hiredDay,
        phone: phone,
        department: department,
        position: position,
        gender: gender,
        tokens: {
            accessToken: "",
            refreshToken: "",
        },
    })

    user.save(user)
        .then((data) => {
            res.redirect('/login');
        })
        .catch((err) => {
            res.redirect(DOMAIN + '/register?error=' + encodeURIComponent(`error_${Object.keys(err.keyValue)[0]}`) + prevData);
        })
}

exports.login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const hasedPassword = await bcrypt.hash(password, 10);
    const prevData = '?email=' + email + '?password=';

    await client.connect();
    const user = await userDBs.findOne({ "account.email": email });

    const accessToken = authMethods.generateAccessToken({ name: user.name, admin: user.admin });
    let refreshToken = authMethods.generateRefreshToken({ name: user.name, admin: user.admin });

    if (!user.tokens.refreshToken) {
        await userDBs.updateOne({ "account.email": email }, { "$set": {"tokens.refreshToken": refreshToken} });
    } else {
        refreshToken = user.tokens.refreshToken;
    }

    if (user) {
        bcrypt.compare(password, user.account.password, function (err, isValid) {
            if (isValid) {
                if (user.admin == "0") {
                    res.cookie('name', user.name)
                       .cookie('accessToken', accessToken, { httpOnly: true })
                       .cookie('refreshToken', refreshToken, { httpOnly: true })
                       .cookie('admin', user.admin)
                       .redirect('/home/employee');
                }
                else {
                     res.cookie('name', user.name)
                        .cookie('accessToken', accessToken, { httpOnly: true })
                        .cookie('refreshToken', refreshToken, { httpOnly: true })
                        .cookie('admin', user.admin)
                        .redirect('/home/admin');
                }
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
    const newPassword = await Math.floor(Math.random()*8 + 1)*10000000 + Math.floor(Math.random()*9999999);
    const newHasedPassword = await bcrypt.hash(`${newPassword}`, 10);

    await client.connect();

    const user = await userDBs.findOne({ "account.email": req.body.email });
    //  Check if the input Email is exist
    if (!user) {
        res.redirect('/password?error=invalid_email+' + req.body.email);
    }

    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 465,
            secure: true,
            auth: {
                user: process.env.SERVER_EMAIL,
                pass: process.env.SERVER_EMAIL_PASSWORD,
            }
        });
    
        let mailOptions = {
            from: process.env.SERVER_EMAIL,
            to: req.body.email,
            subject: "Làm mới mật khẩu HR Management Website!",
            html: `<h4>Vui lòng bảo mật tốt mật khẩu của bạn!  Mật khẩu mới của bạn là: <h2><b>${newPassword}</b></h2>.</h4>`,
        }
        console.log(newHasedPassword);
        await transporter.sendMail(mailOptions, async (err, info) => {
            if (err)    console.log(err);
            else {
                await userDBs.updateOne(
                    { "account.email": req.body.email },
                    { "$set":{"account.password": newHasedPassword} }
                )
                res.redirect('/login');
            }
        })
    } catch (err) {
        res.status(500).send({ err_message: err.message })
    }
    
}