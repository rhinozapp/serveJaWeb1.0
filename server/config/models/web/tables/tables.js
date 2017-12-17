let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    objSchema = new mongoose.Schema({
        tableID: Schema.ObjectId,
        userID : { type: String, required: true},
        tableName : { type: String, required: true}
    });

module.exports = mongoose.model('tables', objSchema);