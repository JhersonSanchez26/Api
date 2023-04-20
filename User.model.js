const mongoose = require('mongoose');

const Users = mongoose.model('UserModel', {
    email: { type: String, require: true, minLength: 5 },
    password: { type: String, require: true },
    salt: { type: String, require: true },
});

module.exports = Users;