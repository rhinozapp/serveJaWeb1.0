exports.firebase = function () {
    let admin = require('firebase-admin'),
        serviceAccount = require('./rhinozapp-70fbe-firebase-adminsdk-359lo-ce5a5a475f.json');

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://rhinozapp-70fbe.firebaseio.com'
    });

    return admin;
};