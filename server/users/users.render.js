const axios = require('axios');
const authMethods = require('../auth/auth.methods');
require('dotenv').config();
const DOMAIN = process.env.DOMAIN;

const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGO_URI);
const userDBs = client.db('company').collection('userdbs');

class renderMethods {
    // register(req, res) {
    //     res.render('register');
    // }
    login(req, res) {
        res.render('login');
    }
    password(req, res) {
        res.render('password');
    }
    addEmployee(req, res) {
        res.render('add_employee');
    }
    async home(req, res) {
        try {
            const user = await userDBs.findOne({ id: req.params.id });
            if (user.admin == 0) {
                res.render('employee');
            } else if (user.admin == 1) {
                res.render('admin');
            }
        } catch (err) {
            res.send(401).send({ err_message: "Failed to find documents!" }).end();
        }
    }
    async singleHome(req, res) {
        try {
            const cookiesList = authMethods.handleCookie(req.headers.cookie);
            const name = decodeURIComponent(cookiesList.name);
            const user = await userDBs.findOne({ name: name });
            if (user) {
                res.redirect('/home/' + user.id);
            }
        } catch (err) {
            res.redirect('/login');
        }
    }
}
module.exports = new renderMethods;