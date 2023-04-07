const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGO_URI);
const userDBs = client.db('company').collection('userdbs');

class UsersMethods {
    createErrorString(body) {
        let result = "";
        for (var key in body) {
            result += `?${key}=` + body[key];
        }
        return result;
    }
    
    getRandomUserPassword() {
        return Math.floor(Math.random() * 8 + 1) * 10000000 + Math.floor(Math.random() * 9999999);
    }

    getHasedPassword(password) {
        return bcrypt.hashSync(password.toString(), 10);
    }

    getRandomEmployeeCode() {
        return `NV${Date.now()}${Math.floor(Math.random() * 99)}`;
    }

    getRandomUserId(identifier) {
        return Date.now() + identifier;
    }

    getPublicIdByImageURL(url) {
        return url.split("/")[url.split("/").length - 1].split(".")[0];
    }

    async sendingMail(options) {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 465,
            secure: true,
            auth: {
                user: process.env.SERVER_EMAIL,
                pass: process.env.SERVER_EMAIL_PASSWORD,
            }
        });
        let mailOptions = {
            from: process.env.SERVER_EMAIL,
            to: options.body.email,
            subject: options.subject,
            html: options.html,
        }
        transporter.sendMail(mailOptions, async (err, info) => {
            if (err) console.log(err);
            else {
                if (options.flexibleOptions.type == null) {
                    return;
                } else if (options.flexibleOptions.type == "update_password") {
                    await options.flexibleOptions.updateNewPassword(
                        options.body.email,
                        options.flexibleOptions.newHasedPassword
                    );
                }
            }
        })
    }
    getRandomPositionCode() {
        return `CV${Date.now()}${Math.floor(Math.random() * 99)}`;
    }
    getNowDate() {
        const dateObj = new Date(Date.now());

        const date = dateObj.getDate().toString().length == 1 ? ("0" + dateObj.getDate()) : dateObj.getDate();
        const month = (dateObj.getMonth() + 1).toString().length == 1
                        ? ("0" + (dateObj.getMonth() + 1))
                        : (dateObj.getMonth() + 1);
        const year = dateObj.getFullYear().toString();

        return (year + "-" + month + "-" + date);
    }
}

module.exports = new UsersMethods;