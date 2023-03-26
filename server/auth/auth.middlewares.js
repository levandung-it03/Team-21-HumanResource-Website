const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const authMethods = require('./auth.methods');

const client = new MongoClient(process.env.MONGO_URI);
const userDBs = client.db('company').collection('userdbs');

exports.verifyToken = async (req, res, next) => {
    try {
        const cookiesList = authMethods.handleCookie(req.headers.cookie);
        
        let accessToken = cookiesList.accessToken;
        const refreshToken = cookiesList.refreshToken;
        const payload = { name: cookiesList.name, admin: cookiesList.admin };

        const accessTokenIsExpired = await authMethods.accessTokenIsExpried(accessToken);
        const refreshTokenIsValid = await authMethods.refreshTokenIsValid(refreshToken);

        if (accessTokenIsExpired) {
            if (refreshTokenIsValid) {
                accessToken = authMethods.generateAccessToken(payload);
                res.cookie('accessToken', accessToken);
            }
            else {
                res.clearCookie('accessToken')
                    .clearCookie('refreshToken')
                    .clearCookie('name')
                    .clearCookie('admin')
                    .redirect('/login');
            }
        }

        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err)    res.redirect('/login');
            else next();
        })
    } catch (err) {
        res.clearCookie('accessToken')
            .clearCookie('refreshToken')
            .clearCookie('name')
            .clearCookie('admin')
            .redirect('/login');
    }
}

exports.checkingLogedIn = async (req, res, next) => {
    try {
        const cookiesList = authMethods.handleCookie(req.headers.cookie);
        const admin = cookiesList.admin;
        let accessToken = cookiesList.accessToken;
        const payload = { name: cookiesList.name };

        const accessTokenIsExpired = await authMethods.accessTokenIsExpried(accessToken);

        if (accessTokenIsExpired) {
            next();
        } else {
            jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    res.clearCookie('accessToken')
                        .clearCookie('refreshToken')
                        .clearCookie('name')
                        .clearCookie('admin');
                    next();
                }
                else {
                    if (admin == "0") {
                        res.redirect('/home/employee');
                    } else {
                        res.redirect('/home/admin');
                    }
                }
            })
        }
    } catch (err) {
        res.clearCookie('accessToken')
            .clearCookie('refreshToken')
            .clearCookie('name')
            .clearCookie('admin');
        next();
    }
}