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
    bussiness: String,
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
    purpose: String,
    dateCreated: String
}, { collection: 'bussiness' });

let groupSchema = new mongoose.Schema({
    group_code: {
        type: String,
        required: true,
        unique: true
    },
    group: {
        type: String,
        required: true,
        unique: true
    },
    employee_list: [
        {
            employee_code: String,
            roles: String,
            avatar_url: String,
            name: {
                type: String,
                required: true
            },
            department: String,
            position: String,
            technique: String,
            dateCreated: String
        }
    ],
    description: String,
    dateCreated: String,
}, { collection: 'group' });

let compliment_typeSchema = new mongoose.Schema({
    compliment_type_code: {
        type: String,
        unique: true,
        required: true
    },
    compliment_type: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    dateCreated: String
}, { collection: 'compliment_type' });

let employee_complimentsSchema = new mongoose.Schema({
    employee_code: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    department: String,
    compliments_list: [
        {
            compliment_code: {
                type: String,
                unique: true,
                required: true
            },
            compliment: {
                type: String,
                required: true
            },
            numbers: String,
            compliment_type: String,
            description: String,
            dateCreated: String
        }
    ],
}, { collection: 'employee_compliments' });

let group_complimentsSchema = new mongoose.Schema({
    group_code: {
        type: String,
        unique: true,
        required: true
    },
    group: {
        type: String,
        required: true
    },
    compliments_list: [
        {
            compliment_code: {
                type: String,
                unique: true,
                required: true
            },
            compliment: {
                type: String,
                required: true
            },
            numbers: String,
            compliment_type: String,
            description: String,
            dateCreated: String
        }
    ],
}, { collection: 'group_compliments' });

let discipline_typeSchema = new mongoose.Schema({
    discipline_type_code: {
        type: String,
        unique: true,
        required: true
    },
    discipline_type: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    dateCreated: String
}, { collection: 'discipline_type' });

let employee_disciplineSchema = new mongoose.Schema({
    employee_code: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    department: String,
    discipline_list: [
        {
            discipline_code: {
                type: String,
                unique: true,
                required: true
            },
            discipline: {
                type: String,
                required: true
            },
            numbers: String,
            discipline_type: String,
            description: String,
            dateCreated: String
        }
    ],
}, { collection: 'employee_discipline' });

let group_disciplineSchema = new mongoose.Schema({
    group_code: {
        type: String,
        unique: true,
        required: true
    },
    group: {
        type: String,
        required: true
    },
    discipline_list: [
        {
            discipline_code: {
                type: String,
                unique: true,
                required: true
            },
            discipline: {
                type: String,
                required: true
            },
            numbers: String,
            discipline_type: String,
            description: String,
            dateCreated: String
        }
    ],
}, { collection: 'group_discipline' });

let insuranceSchema = new mongoose.Schema({
    employee_code: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    insurance_code: {
        type: String,
        unique: true,
        required: true
    },
    insurance_book_number: {
        type: String,
        unique: true
    },
    insurance_card: {
        type: String,
        unique: true,
        required: true
    },
    insurance_type: {
        type: String,
        required: true
    },
    insurancePlace: String,
    insuranceCash: String,
    startingDate: String,
    endingDate: String,
    status: String,
    household: String,
    isSubmitted: String,
    household_code: String,
    description: String,
    dateCreated: String
}, { collection: 'insurance' });

let contract_typeSchema = new mongoose.Schema({
    contract_type_code: {
        type: String,
        unique: true,
        required: true
    },
    contract_type: {
        type: String,
        required: true
    },
    description: String,
    dateCreated: String,
}, { collection: 'contract_type' });

let contractSchema = new mongoose.Schema({
    contract_code: {
        type: String,
        unique: true,
        required: true
    },
    contract_type: String,
    employee_code: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    corporation: String,
    tax_type: String,
    signingDate: String,
    startingDate: String,
    endingDate: String,
    actuallyDate: String,
    employee_type: String,
    degree: String,
    department: String,
    position: String,
    originalSalary: Number,
    negotiableRatio: Number,
    insuranceFee: Number,
    internalFund: Number,
    unionFee: Number,
    description: String,
    dateCreated: String,
}, { collection: 'contract' });

let Group = mongoose.model('group', groupSchema);
let UserDb = mongoose.model('userdbs', userSchema);
let Salary = mongoose.model('salary', salarySchema);
let Degree = mongoose.model('degree', degreeSchema);
let Position = mongoose.model('position', positionSchema);
let Technique = mongoose.model('technique', techniqueSchema);
let Bussiness = mongoose.model('bussiness', bussinessSchema);
let Department = mongoose.model('department', departmentSchema);
let Contract_type = mongoose.model('contract_type', contract_typeSchema);
let Contract = mongoose.model('contract', contractSchema);
let Employee_type = mongoose.model('employee_type', employeeTypeSchema);
let Compliment_type = mongoose.model('compliment_type', compliment_typeSchema);
let Employee_compliments = mongoose.model('employee_compliments', employee_complimentsSchema);
let Group_compliments = mongoose.model('group_compliments', group_complimentsSchema);
let Discipline_type = mongoose.model('discipline_type', discipline_typeSchema);
let Employee_discipline = mongoose.model('employee_discipline', employee_disciplineSchema);
let Group_discipline = mongoose.model('group_discipline', group_disciplineSchema);
let Insurance = mongoose.model('insurance', insuranceSchema);

module.exports = { UserDb, Salary, Position, Degree, Department, Employee_type, Technique, Bussiness, Group,
Compliment_type, Employee_compliments, Group_compliments, Discipline_type, Employee_discipline,
Group_discipline, Contract_type, Contract, Insurance };