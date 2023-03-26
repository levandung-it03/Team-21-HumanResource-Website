const axios = require('axios');
const authMethods = require('../auth/auth.methods');
require('dotenv').config();
const DOMAIN = process.env.DOMAIN;

class renderMethods {
    register(req, res) {
        res.render('register');
    }
    login(req, res) {
        res.render('login');
    }
    password(req, res) {
        res.render('password');
    }
    adminHome(req, res) {
        if (authMethods.handleCookie(req.headers.cookie).admin == "0") {
            res.redirect('/home/employee');
        } else {
            res.render('admin');
        }
    }
    employeeHome(req, res) {
        if (authMethods.handleCookie(req.headers.cookie).admin != "0") {
            res.redirect('/home/admin');
        } else {
            res.render('employee');
        }
    }
}
module.exports = new renderMethods;