var mongoose = require('mongoose');
Schema = mongoose.schema;

let userSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    sobrenome: { type: String },
    email: { type: String, required: true },
    senha: [{ type: String, required: true, 'default': '12345678' }],
    endereco: [{
        rua: { type: String },
        cep: String,
        numero: String
    }]
});

module.exports = mongoose.model('User', userSchema);