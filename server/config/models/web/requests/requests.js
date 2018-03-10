let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    objSchema = new mongoose.Schema({
        requestID: Schema.ObjectId,
        userID : { type: Schema.ObjectId, required: true, ref : 'userAdmin'},
        userAppID : { type: Schema.ObjectId, required: true, ref : 'userApp'},
        tableID : { type: Schema.ObjectId, required: true, ref : 'tables'},
        products : [
            {
                productID : { type: Schema.ObjectId, ref : 'products' },
                status : { type : Boolean, default:false, required: true },
                dateInsert : { type : Date, default: Date.now }
            }
        ],
        status : { type : Boolean, required: true },
        requireStop : { type : Boolean, required: true, default : false },
        dateCreate : { type : Date, default: Date.now }
    });

module.exports = mongoose.model('requests', objSchema);