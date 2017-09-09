exports.routes = function (app) {
    var path = require('path'),
        appDir = path.dirname(require.main.filename),
        multipart = require('connect-multiparty'),
        multiparty = require('multiparty'),
        expressJwt = require('express-jwt'),
        authenticate = expressJwt({
            secret: 'rhinoz'
        });

    //region Authentication Routes
    var doLogin = require('./api/modules/login/doLogin');
    app.post('/login', doLogin.doLogin);
    //endregion

    //region Response
    app.get('*', function (req, res) {
        res.sendFile(appDir + '/www/index.html');
    });
    //endregion
};