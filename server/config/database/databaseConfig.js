module.exports = function(uri) {
    let mongoose = require('mongoose');
<<<<<<< HEAD
=======
    mongoose.Promise = global.Promise;
>>>>>>> 462de9f4c9b5087f19df475bd5ffa19bd84d02e4

    mongoose.connect(uri);

    mongoose.connection.on('connected', function() {
<<<<<<< HEAD
        console.log('Conectado ao MongoDB')
    })

    mongoose.connection.on('error', function(error) {
        console.log('Erro na conexão: ' + error);
    })

    mongoose.connection.on('disconnected', function() {
        console.log('Desconectado do MongoDB');
    })
=======
        console.log('Connected on MongoDB');
    });

    mongoose.connection.on('error', function(error) {
        console.log('Error on connection: ' + error);
    });

    mongoose.connection.on('disconnected', function() {
        console.log('Disconnected on MongoDB');
    });
>>>>>>> 462de9f4c9b5087f19df475bd5ffa19bd84d02e4

    process.on('SIGNIT', function() {
        mongoose.connection.close(function() {
            console.log('Aplicação terminada, conexão fechada');
            process.exit(0);
        })
<<<<<<< HEAD
    })
}
=======
    });
};
>>>>>>> 462de9f4c9b5087f19df475bd5ffa19bd84d02e4
