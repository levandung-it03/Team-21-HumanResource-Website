const mongoose = require('mongoose');

// method defind a schema for submitted data.
var userSchema = new mongoose.Schema({
    admin: Number,
    employee_code: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    avatar_url: String,
    account: {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    dateCreated: String,
    identifier: {
        type: String,
        required: true,
        unique: true,
    },
    identifier_date: String,
    identifier_place: String,
    gender: String,
    birthday: String,
    birthplace: String,
    country: String,
    ethnic: String,
    religion: String,
    phone: String,
    household: String,
    temporary_address: String,
    department: String,
    employee_type: String,
    position: String,
    degree: String,
    status: String,
    refreshToken: String,
}, { collection: 'userdbs' });

var salarySchema = new mongoose.Schema({
    employee_code: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    position: String,
    salary_per_day: Number,
    department: String,
    multipleSalary: Number,
    salaryList: [
        {
            year: Number,
            month: Number,
            totalDays: Number,
            dayOff: Number,
            allowance: Number,
            advanceSalaray: Number,
            bonusSalary: Number,
            tax: Number,
            realSalary: Number
        }
    ]
}, { collection: 'salary' });

var departmentSchema = new mongoose.Schema({
    department_code: {
        type: String,
        unique: true,
        required: true,
    },
    department: {
        type: String,
        unique: true,
        required: true,
    },
    multipleSalary: Number,
    dateCreated: String,
}, { collection: 'department' });

var positionSchema = new mongoose.Schema({
    position_code: {
        type: String,
        unique: true,
        required: true
    },
    position: {
        type: String,
        unique: true,
        required: true
    },
    salary_per_day: Number,
    dateCreated: String,
}, { collection: 'position' });

var UserDb = mongoose.model('userdbs', userSchema);
var Salary = mongoose.model('salary', salarySchema);
var Position = mongoose.model('position', positionSchema);
var Department = mongoose.model('department', departmentSchema);

module.exports = { UserDb, Salary, Position, Department };