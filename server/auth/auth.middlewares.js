const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const authMethods = require('./auth.methods');

const client = new MongoClient(process.env.MONGO_URI);
const userDBs = client.db('company').collection('userdbs');

function clearCookiesAndReturnLogin(res) {
    res.clearCookie('accessToken')
        .clearCookie('refreshToken')
        .clearCookie('id')
        .clearCookie('admin')
        .redirect('/login');
    return;
}

exports.verifyToken = async (req, res, next) => {
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
                clearCookiesAndReturnLogin(res);
            }
        }

        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (decoded.admin == cookiesList.admin) {
                next();
            } else {
                clearCookiesAndReturnLogin(res);
            }
        })
    } catch (err) {
        clearCookiesAndReturnLogin(res);
    }
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
                    res.clearCookie('accessToken')
                        .clearCookie('refreshToken')
                        .clearCookie('id')
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
            .clearCookie('id')
            .clearCookie('admin');
        next();
    }
}