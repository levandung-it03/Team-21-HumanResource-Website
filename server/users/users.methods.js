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
        return Math.floor(Math.random() * 8 + 1) * 10000000 + Math.floor(Math.random() * 98  + 199999);
    }

    getHasedPassword(password) {
        return bcrypt.hashSync(password.toString(), 10);
    }

    getRandomEmployeeCode() {
        return `NV${Date.now()}${Math.floor(Math.random() * 98  + 1)}`;
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
                    return info;
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
        return `CV${Date.now()}${Math.floor(Math.random() * 98  + 1)}`;
    }
    getRandomDegreeCode() {
        return `BC${Date.now()}${Math.floor(Math.random() * 98  + 1)}`;
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
    getRandomDepartmentCode() {
        return `PB${Date.now()}${Math.floor(Math.random() * 98  + 1)}`;
    }
    getRandomEmployeeTypeCode() {
        return `LNV${Date.now()}${Math.floor(Math.random() * 9)}`;
    }
    getRandomTechniqueCode() {
        return `CM${Date.now()}${Math.floor(Math.random() * 98  + 1)}`;
    }
    getRandomBussinessCode() {
        return `CT${Date.now()}${Math.floor(Math.random() * 98  + 1)}`;
    }
    getRandomGroupCode() {
        return `DN${Date.now()}${Math.floor(Math.random() * 98  + 1)}`;
    }
    getRandomComplimentTypeCode() {
        return `KT${Date.now()}${Math.floor(Math.random() * 98  + 1)}`;
    }
    getRandomComplimentCode(dateCreated, compliment_type_code) {
        return `KN${Date.now()}${Math.floor(Math.random() * 98  + 1)}`;
    }
    getRandomDisciplineTypeCode() {
        return `KL${Date.now()}${Math.floor(Math.random() * 98  + 1)}`;
    }
    getRandomDisciplineCode(dateCreated, discipline_type_code) {
        return `LN${Date.now()}${Math.floor(Math.random() * 98  + 1)}`;
    }
    getRandomInsuranceCode() {
        return `BH${Date.now()}${Math.floor(Math.random() * 98  + 1)}`;
    }
    getRandomContractTypeCode(dateCreated, discipline_type_code) {
        return `LH${Date.now()}${Math.floor(Math.random() * 98  + 1)}`;
    }
    getRandomContractCode() {
        return `HD${Date.now()}${Math.floor(Math.random() * 98  + 1)}`;
    }
}

module.exports = new UsersMethods;