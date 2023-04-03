const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGO_URI);
const userDBs = client.db('company').collection('userdbs');

class UsersMethods {
    createErrorString(body) {
        return ("?name=" + body.name
        + "?email=" + body.email
        + "?identifier=" + body.identifier
        + "?identifier_date=" + body.identifier_date
        + "?identifier_place=" + body.identifier_place
        + "?gender=" + body.gender
        + "?birthday=" + body.birthday
        + "?birthplace=" + body.birthplace
        + "?country=" + body.country
        + "?ethnic=" + body.ethnic
        + "?religion=" + body.religion
        + "?phone=" + body.phone
        + "?household=" + body.household
        + "?temporary_address=" + body.temporary_address
        + "?department=" + body.department
        + "?employee_type=" + body.employee_type
        + "?position=" + body.position
        + "?degree=" + body.degree);
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
}

module.exports = new UsersMethods;