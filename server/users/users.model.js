const mongoose = require('mongoose');

// method defind a schema for submitted data.
var schema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
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
    identifier: {
        type: String,
        required: true,
        unique: true,
    },
    identifier_date: String,
    identifier_place: String,
    gender: String,
    birthday: Date,
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
});

// mongoose.model(<Collection_name>, <Schema_name>); method complies the request's data with schema
var UserDb = mongoose.model('userdb', schema);

// export UserDb object
module.exports = UserDb;