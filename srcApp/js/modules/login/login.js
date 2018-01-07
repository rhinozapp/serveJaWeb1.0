/**
 * Created by guiga on 04/02/2017.
 */

angular.module('login', [])
    .controller('loginController', login);

function login(loginService, $window, toastAction) {
    var login = this;
    login.vars = {};

    login.functions = {
        core : function () {},

        loginFacebook : function () {
            loginService.doLoginFacebook().then(function (data) {
                loginService.recordData.save(data, function (result) {
                    switch (true){
                        case result.status === true:
                            login.vars.message = 'Logado! :)';
                            $window.localStorage.token = result.token;
                            $window.location.reload();
                            break;

                        case result.status === false:
                            login.vars.message = 'Alguma coisa deu errado, tente novamente :(';
                            break;

                        default:
                            login.vars.message = 'Alguma coisa deu errado, tente novamente :(';
                    }

                    toastAction.show({
                        top : false,
                        bottom : true,
                        left : false,
                        right : true,
                        text : login.vars.message,
                        scope : login
                    });
                })
            });
        },

        loginHack : function () {
            loginService.doLoginHack.save({}, function (result) {
                $window.localStorage.token = result.token;
                $window.location.reload();
            })
        }
    };

    login.functions.core();
}