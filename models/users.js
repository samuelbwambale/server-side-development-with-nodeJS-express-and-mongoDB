const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({
   
    admin: {
        type: Boolean,
        default: false
    }
});
// Will capture username and password and hash the password
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
