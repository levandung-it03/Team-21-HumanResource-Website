const mongoose = require('mongoose');

// method defind a schema for submitted data.
var schema = new mongoose.Schema({
    identifier: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    birthday: {
        type: Date,
    },
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
    admin: String,
    ['hired-day']: {
        type: Date,
    },
    phone: {
        type: String,
    },
    department: String,
    position: String,
    gender: String,
    tokens: {
        accessToken: String,
        refreshToken: String,
    }
});

// mongoose.model(<Collection_name>, <Schema_name>); method complies the request's data with schema
var UserDb = mongoose.model('userdb', schema);

// export UserDb object
module.exports = UserDb;