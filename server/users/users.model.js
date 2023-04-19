const mongoose = require('mongoose');

// method defind a schema for submitted data.
let userSchema = new mongoose.Schema({
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

let salarySchema = new mongoose.Schema({
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
            dateCreated: {
                type: String,
                required: true,
            },
            totalDays: Number,
            dayOff: Number,
            allowance: Number,
            advanceSalary: Number,
            bonusSalary: Number,
            tax: Number,
            realSalary: Number,
        }
    ]
}, { collection: 'salary' });

let departmentSchema = new mongoose.Schema({
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

let degreeSchema = new mongoose.Schema({
    degree_code: {
        type: String,
        unique: true,
        required: true
    },
    degree: {
        type: String,
        unique: true,
        required: true
    },
    multipleSalary: Number,
    dateCreated: String,
}, { collection: 'degree' });

let techniqueSchema = new mongoose.Schema({
    technique_code: {
        type: String,
        unique: true,
        required: true
    },
    technique: String,
    department: {
        type: String,
        required: true
    },
    employee_code: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: String,
    dateCreated: String
}, { collection: 'technique' });

let positionSchema = new mongoose.Schema({
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

let employeeTypeSchema = new mongoose.Schema({
    employee_type_code: {
        type: String,
        unique: true,
        required: true
    },
    employee_type: {
        type: String,
        unique: true,
        required: true
    },
    multipleSalary: Number,
    dateCreated: String,
}, { collection: 'employee_type' });

let bussinessSchema = new mongoose.Schema({
    bussiness_code: {
        type: String,
        unique: true,
        required: true
    },
    bussiness: {
        type: String,
        unique: true,
        required: true
    },
    employee_code: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    startingDate: String,
    endingDate: String,
    location: String,
    purpose: String
}, { collection: 'bussiness' });

let UserDb = mongoose.model('userdbs', userSchema);
let Salary = mongoose.model('salary', salarySchema);
let Degree = mongoose.model('degree', degreeSchema);
let Position = mongoose.model('position', positionSchema);
let Technique = mongoose.model('technique', techniqueSchema);
let Bussiness = mongoose.model('bussiness', bussinessSchema);
let Department = mongoose.model('department', departmentSchema);
let Employee_type = mongoose.model('employee_type', employeeTypeSchema);

module.exports = { UserDb, Salary, Position, Degree, Department, Employee_type, Technique, Bussiness };