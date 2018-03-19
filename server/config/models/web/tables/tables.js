let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    objSchema = new mongoose.Schema({
        tableID: Schema.ObjectId,
        userID : { type: Schema.ObjectId, required: true, ref : 'userAdmin'},
        tableName : { type: String, required: true},
        qrPath : { type: String }
    });

module.exports = mongoose.model('tables', objSchema);