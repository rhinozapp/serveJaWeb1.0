let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    objSchema = new mongoose.Schema({
        profileID: Schema.ObjectId,
        name : { type: String, required: true },
        description : { type: String, required: false },
        pageFacebook : { type: String, required: false },
        webSite : { type: String, required: false },
        logoPath : { type: String, required: false },
        userID : { type: String, required: true, index : {unique : true}},
        zipCode: { type: String, required: true },
        address : { type: String, required: true },
        number : { type: String},
        complement : { type: String},
        neighborhood : { type: String, required: true },
        city : { type: String, required: true },
        uf : { type: String, required: true },
        lat : { type: String, required: true },
        long : { type: String, required: true },
        sunday : {
            status : { type : Boolean },
            timeStart : { type: String },
            timeEnd : { type: String }
        },
        monday : {
            status : { type : Boolean },
            timeStart : { type: String },
            timeEnd : { type: String }
        },
        tuesday : {
            status : { type : Boolean },
            timeStart : { type: String },
            timeEnd : { type: String }
        },
        wednesday : {
            status : { type : Boolean },
            timeStart : { type: String },
            timeEnd : { type: String }
        },
        thursday : {
            status : { type : Boolean },
            timeStart : { type: String },
            timeEnd : { type: String }
        },
        friday : {
            status : { type : Boolean },
            timeStart : { type: String },
            timeEnd : { type: String }
        },
        saturday : {
            status : { type : Boolean },
            timeStart : { type: String },
            timeEnd : { type: String }
        }
    });

module.exports = mongoose.model('userAdminProfile', objSchema);