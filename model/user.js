var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var maxlength=3;

var userSchema = mongoose.Schema({
    local: {
        email: String,
        password: String,
        registrationdate: Date,
        loginDate:{date: Date},
        querys: []
    },
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};
module.exports = mongoose.model('User', userSchema);