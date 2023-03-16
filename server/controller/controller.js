const UserDb = require('../model/model');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGO_URI);
const path = require('path');

const DOMAIN = process.env.DOMAIN;

exports.register = async (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    const adminCode = Math.floor(Math.random() * 1000000 + 1) + Math.floor(Math.random() * 9 + 1) * 1000000;
    const adminRightCode = req.body['admin-right'] == "admin" ? adminCode : 0;

    const identifier = req.body.identifier;
    const name = req.body.name;
    const birthday = req.body.birthday;
    const email = req.body.email;
    const password = req.body.password;
    const hiredDay = req.body['hired-day'];
    const phone = req.body.phone;
    const department = req.body.department;
    const position = req.body.position;
    const adminRight= req.body['admin-right'];
    const gender = req.body.gender;

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
            password: password,
            ['admin-right']: adminRightCode,
        },
        hiredDay: hiredDay,
        phone: phone,
        department: department,
        position: position,
        gender: gender,
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
    const adminCode = req.body['admin-right'];
    const prevData = '?email=' + email + '?password=' + password + '?admin-right=' + adminCode;

    await client.connect();

    const user = await client.db('company').collection('userdbs').findOne({ "account.email": email });

    if (user) {
        if (user.account.password === password) {
            if (user.account['admin-right'] === adminCode) {
                //  res.redirect(DOMAIN + 'home/admin/:id');
                res.send("Get Admin Successfully!");
            } else if (user.account['admin-right'] === "0") {
                //  res.redirect(DOMAIN + 'home/employee/:id');
                res.send("Get Employee Successfully!");
            } else {
                res.redirect(DOMAIN + '/login?error=' + encodeURIComponent('error_adminCode') + prevData);
            }
        } else {
            res.redirect(DOMAIN + '/login?error=' + encodeURIComponent('error_password') + prevData);
        }
    } else {
        res.redirect(DOMAIN + '/login?error=' + encodeURIComponent('error_email') + prevData);
    }
    client.close();
}