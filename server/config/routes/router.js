module.exports = function (app) {
    var path = require('path'),
        appDir = path.dirname(require.main.filename),
        multipart = require('connect-multiparty'),
        multiparty = require('multiparty'),
        expressJwt = require('express-jwt'),
        authenticate = expressJwt({
            secret: 'rhinoz'
        });


    //region WEB Routes
    //region SignUp / doLogin
    let signUpWeb = require('./web/modules/login/signUp');
    app.post('/web/signUp', signUpWeb.signup);

    let doLoginWeb = require('./web/modules/login/doLogin');
    app.post('/web/doLogin', doLoginWeb.doLogin);
    //endregion

    //endregion

    //region Response
    app.get('*', function (req, res) {
        res.sendFile(appDir + '/www/index.html');
    });
    //endregion
};