let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    objSchema = new mongoose.Schema({
        userAdminID: Schema.ObjectId,
        email: { type: String, required: true, index : {unique : true}},
        password : { type: String, required: true },
        hashRecovery : { type: String },
        name : { type: String, required: true },
        cnpj : { type: String, required: true },
        description : { type: String, required: false },
        pageFacebook : { type: String, required: false },
        pageInstagram : { type: String, required: false },
        webSite : { type: String, required: false },
        logoPath : { type: String, required: false },
        headerImgPath : { type: String, required: false },
        zipCode: { type: String, required: true },
        address : { type: String, required: true },
        number : { type: String},
        complement : { type: String},
        neighborhood : { type: String, required: true },
        city : { type: String, required: true },
        uf : { type: String, required: true },
        loc: {
            type : { type: String },
            coordinates: [Number]
        },
        statusLoc : {type : Boolean},
        sunday : {
            status : { type : Boolean, default : false },
            timeStart : { type: String },
            timeEnd : { type: String },
            sundayMenu : { type: String }
        },
        monday : {
            status : { type : Boolean, default : false },
            timeStart : { type: String },
            timeEnd : { type: String },
            mondayMenu : { type: String }
        },
        tuesday : {
            status : { type : Boolean, default : false },
            timeStart : { type: String },
            timeEnd : { type: String },
            tuesdayMenu : { type: String }
        },
        wednesday : {
            status : { type : Boolean, default : false },
            timeStart : { type: String },
            timeEnd : { type: String },
            wednesdayMenu : { type: String }
        },
        thursday : {
            status : { type : Boolean, default : false },
            timeStart : { type: String },
            timeEnd : { type: String },
            thursdayMenu : { type: String }
        },
        friday : {
            status : { type : Boolean, default : false },
            timeStart : { type: String },
            timeEnd : { type: String },
            fridayMenu : { type: String }
        },
        saturday : {
            status : { type : Boolean, default : false },
            timeStart : { type: String },
            timeEnd : { type: String },
            saturdayMenu : { type: String }
        }
    });

objSchema.index({ loc: '2dsphere' });
module.exports = mongoose.model('userAdmin', objSchema);