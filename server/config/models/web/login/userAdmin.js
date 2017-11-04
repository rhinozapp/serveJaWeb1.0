var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    salt = bcrypt.genSaltSync(10);

let objSchema = new mongoose.Schema({
    userAdminID: Schema.ObjectId,
    email: { type: String, required: true, index : {unique : true}},
    password : { type: String, required: true }
});

module.exports = mongoose.model('userAdmin', objSchema);