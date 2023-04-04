const axios = require('axios');
const authMethods = require('../auth/auth.methods');
require('dotenv').config();
const DOMAIN = process.env.DOMAIN;

const { MongoClient } = require('mongodb');
const { link } = require('fs');
const client = new MongoClient(process.env.MONGO_URI);
const userDBs = client.db('company').collection('userdbs');

async function getAllUser() {
    const allUser = await userDBs.find({});
    return await allUser.toArray();
}

async function getSpecifiedUser(name) {
    const user = await userDBs.findOne({ name: name });
    return user;
}

async function getCurrentUser(req) {
    const cookiesList = authMethods.handleCookie(req.headers.cookie);
    const name = decodeURIComponent(cookiesList.name);
    const user = await getSpecifiedUser(name);

    return user;
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
            res.redirect('/login');
        }
    }
    async admin_statistic(req, res) {
        try {
            const allUsers = await getAllUser();
            const user = await getCurrentUser(req);
            res.render('admin_general_statistic', {
                user: user,
                employeeList: allUsers,
                layout: './layouts/admin'
            });
        } catch (err) {
            res.redirect('/login');
        }
    }
    async admin_employeeList(req, res) {
        try {
            const allUsers = await getAllUser();
            const user = await getCurrentUser(req);
            res.render('admin_general_employee-list', {
                user: user,
                employeeList: allUsers,
                layout: './layouts/admin'
            });
        } catch (err) {
            res.redirect('/login');
        }
    }
    async admin_addEmployee(req, res) {
        try {
            const user = await getCurrentUser(req);
            res.render('admin_employee_add-employee', {
                user: user,
                layout: './layouts/admin'
            });
        } catch (err) {
            res.redirect('/login');
        }
    }
}

module.exports = new renderMethods;