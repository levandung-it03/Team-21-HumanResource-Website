const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const authMethods = require('./auth.methods');

const client = new MongoClient(process.env.MONGO_URI);
const userDBs = client.db('company').collection('userdbs');

function clearCookiesAndReturnLogin(res) {
    res.clearCookie('accessToken')
        .clearCookie('refreshToken')
        .clearCookie('name')
        .clearCookie('admin')
        .redirect('/login');
    return;
}

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
                clearCookiesAndReturnLogin(res);
            }
        }

        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (decoded.admin == cookiesList.admin) {
                next();
            }
            else {
                clearCookiesAndReturnLogin(res);
            }
        })
    } catch (err) {
        clearCookiesAndReturnLogin(res);
    }
}

exports.verifyAdmin = (req, res, next) => {
    const cookiesList = authMethods.handleCookie(req.headers.cookie);

    jwt.verify(cookiesList.accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (decoded.admin == 1) {
            next();
        }
        else {
            clearCookiesAndReturnLogin(res);
        }
    })
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
                    res.redirect('/home');
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