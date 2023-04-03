const axios = require('axios');
const authMethods = require('../auth/auth.methods');
require('dotenv').config();
const DOMAIN = process.env.DOMAIN;

const { MongoClient } = require('mongodb');
const { link } = require('fs');
const client = new MongoClient(process.env.MONGO_URI);
const userDBs = client.db('company').collection('userdbs');
async function getUser(req) {
    const cookiesList = authMethods.handleCookie(req.headers.cookie);
    const name = decodeURIComponent(cookiesList.name);
    const user = await userDBs.findOne({ name: name });

    return user;
}
async function adminOption(user) {
    return {user: user, layout: './layouts/admin'};
}
async function employeeOption(user) {
    return {user: user, layout: './layouts/employee'};
}

class renderMethods {
    login(req, res) {
        res.render('login', { layout: './login' });
    }
    password(req, res) {
        res.render('password', { layout: './password' });
    }
    addEmployee(req, res) {
        res.render('add_employee');
    }
    async home(req, res) {
        try {
            const user = await getUser(req);
            if (user.admin == 0) {
                res.render('home', await employeeOption(user));
            } else if (user.admin == 1) {
                res.render('home', await adminOption(user));
            }
        } catch (err) {
            res.redirect('/login');
        }
    }
    async admin_statistic(req, res) {
        res.render('admin_general_statistic', await adminOption(await getUser(req)));
    }
}

module.exports = new renderMethods;