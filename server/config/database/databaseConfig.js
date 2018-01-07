module.exports = function (uri) {
    let mongoose = require('mongoose');
    mongoose.Promise = global.Promise;

    mongoose.connect(uri);

    mongoose.connection.on('connected', function () {
        console.log('Connected on MongoDB');
    });

    mongoose.connection.on('error', function (error) {
        console.log('Error on connection: ' + error);
    });

    mongoose.connection.on('disconnected', function () {
        console.log('Disconnected on MongoDB');
    });

    process.on('SIGNIT', function () {
        mongoose.connection.close(function () {
            console.log('Aplicação terminada, conexão fechada');
            process.exit(0);
        })
    });
};
