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
    //region ZipCode
    let zipCodeWeb = require('./web/app/helpers/zipCode');
    app.post('/web/zipCode', authenticate, zipCodeWeb.zipCode);
    //endregion

    //region SignUp / doLogin
    let signUpWeb = require('./web/modules/login/signUp');
    app.post('/web/signUp', signUpWeb.signup);

    let doLoginWeb = require('./web/modules/login/doLogin');
    app.post('/web/doLogin', doLoginWeb.doLogin);
    //endregion

    //region Profile
    let updateProfileWeb = require('./web/modules/profile/updateProfile');
    app.post('/web/updateProfile', multipart({uploadDir: './public/files/logoProfile/'}), updateProfileWeb.updateProfile);

    let getProfileWeb = require('./web/modules/profile/getProfile');
    app.post('/web/getProfile', authenticate, getProfileWeb.getProfile);
    //endregion
    //endregion

    //region Response
    app.get('*', function (req, res) {
        res.sendFile(appDir + '/www/index.html');
    });
    //endregion
};