const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const authMethods = require('./auth.methods');

const client = new MongoClient(process.env.MONGO_URI);
const userDBs = client.db('company').collection('userdbs');

function clearCookies(res) {
    res.clearCookie('accessToken')
        .clearCookie('refreshToken')
        .clearCookie('id')
        .clearCookie('admin')
    return;
}

exports.verifyTokenAndGenerateAccessTokenIfExpiring = async (req, res, next) => {
    try {
        const cookiesList = authMethods.handleCookie(req.headers.cookie);

        let accessToken = cookiesList.accessToken;
        const refreshToken = cookiesList.refreshToken;

        const accessTokenIsExpired = authMethods.accessTokenIsExpried(accessToken);
        const refreshTokenIsValid = authMethods.refreshTokenIsValid(refreshToken);

        if (accessTokenIsExpired) {
            if (refreshTokenIsValid.result) {
                const payload = { id: refreshTokenIsValid.id, admin: refreshTokenIsValid.admin };
                accessToken = authMethods.generateAccessToken(payload);
                await res.status(200).cookie('accessToken', accessToken);
            }
            else {
                clearCookies(res);
                res.redirect('/login');
            }
        }
        res.locals.verifyObject = { accessToken: accessToken, adminInCookie: cookiesList.admin }
        next();
    } catch (err) {
        clearCookies(res);
        res.redirect('/login');
    }
}

exports.verifyAdmin = async (req, res, next) => {
    jwt.verify(res.locals.verifyObject.accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (decoded.admin == 1 && res.locals.verifyObject.adminInCookie == 1) {
            next();
        } else {
            clearCookies(res);
            res.redirect('/login');
        }
    })
}

exports.verifyEmployee = async (req, res, next) => {
    jwt.verify(res.locals.verifyObject.accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (decoded.admin == 0 && res.locals.verifyObject.adminInCookie == 0) {
            next();
        } else {
            clearCookies(res);
            res.redirect('/login');
        }
    })
}

exports.checkingLogedIn = async (req, res, next) => {
    try {
        const cookiesList = authMethods.handleCookie(req.headers.cookie);
        const admin = cookiesList.admin;
        let accessToken = cookiesList.accessToken;
        const payload = { id: cookiesList.id };

        const accessTokenIsExpired = authMethods.accessTokenIsExpried(accessToken);

        if (accessTokenIsExpired.result) {
            next();
        } else {
            jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    clearCookies(res);
                    next();
                }
                else {
                    if (decoded.admin == 1) {
                        res.redirect('/admin/general');
                    } else {
                        res.redirect('/admin/general');
                    }
                }
            })
        }
    } catch (err) {
        clearCookies(res);
        next();
    }
}