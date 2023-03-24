const UserDb = require('./users.model');
const authMethods = require('../auth/auth.methods');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const client = new MongoClient(process.env.MONGO_URI);
const userDBs = client.db('company').collection('userdbs');
const DOMAIN = process.env.DOMAIN;

exports.register = async (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    const adminCode = Math.floor(Math.random() * 1000000 + 1) + Math.floor(Math.random() * 9 + 1) * 1000000;
    const adminRightCode = req.body['admin-right'] == "admin" ? adminCode : 0;

    const { name, identifier, birthday, email, password, errHiredDay, phone,
            department, position, errAdminRight, gender } = req.body;
    
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
        + '?admin-right=' + adminRight
        + '?gender=' + gender;

    const user = new UserDb({
        identifier: identifier,
        name: name,
        birthday: birthday,
        account: {
            email: email,
            password: hashedPass,
            ['admin-right']: adminRightCode,
        },
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
            res.render('login');
        })
        .catch((err) => {
            res.redirect(DOMAIN + '/register?error=' + encodeURIComponent(`error_${Object.keys(err.keyValue)[0]}`) + prevData);
        })
}

exports.login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    
    const hasedPassword = await bcrypt.hash(password, 10);
    const adminCode = req.body['admin-right'];
    const prevData = '?email=' + email + '?password=' + '?admin-right=' + adminCode;

    await client.connect();

    const user = await userDBs.findOne({ "account.email": email });
    const accessToken = authMethods.generateAccessToken({ name: user.name, adminCode: user.account['admin-right'] });
    let refreshToken = authMethods.generateRefreshToken({ name: user.name, adminCode: user.account['admin-right'] });

    if (!user.tokens.refreshToken) {
        await userDBs.updateOne({ "account.email": email }, { "$set": {"tokens.refreshToken": refreshToken} });
    } else {
        refreshToken = user.tokens.refreshToken;
    }

    if (user) {
        bcrypt.compare(password, user.account.password, function (err, isValid) {
            if (isValid) {
                if (user.account['admin-right'] == "0") {
                    res.cookie('name', user.name)
                       .cookie('accessToken', accessToken, { httpOnly: true })
                       .cookie('refreshToken', refreshToken, { httpOnly: true })
                       .cookie('adminCode', user.account['admin-right'])
                       .redirect('/employee');
                }
                else if (user.account['admin-right'] === adminCode) {
                     res.cookie('name', user.name)
                        .cookie('accessToken', accessToken, { httpOnly: true })
                        .cookie('refreshToken', refreshToken, { httpOnly: true })
                        .cookie('adminCode', user.account['admin-right'])
                        .redirect('/admin');
                }
                else    res.redirect(DOMAIN + '/login?error=' + encodeURIComponent('error_adminCode') + prevData);
            } else {
                res.redirect(DOMAIN + '/login?error=' + encodeURIComponent('error_password') + prevData);
            }
            //  ----------------------------------
        })
        //  -------------------------------------------
    } else {
        res.redirect(DOMAIN + '/login?error=' + encodeURIComponent('error_email') + prevData);
    }
    client.close();
}