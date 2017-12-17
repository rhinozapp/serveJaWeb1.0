let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    objSchema = new mongoose.Schema({
        userAdminID: Schema.ObjectId,
        email: { type: String, required: true, index : {unique : true}},
        password : { type: String, required: true },
        hashRecovery : { type: String }
    });

module.exports = mongoose.model('userAdmin', objSchema);