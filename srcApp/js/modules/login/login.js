angular.module('login', [])
    .controller('loginController', login);

function login(loginService, $window, toastAction) {
    var login = this;
    login.vars = {};

    login.functions = {
        core : function () {},

        loginFacebook : function () {
            loginService.doLoginFacebook().then(function (data) {
                if(data.status){
                    loginService.recordData.save({
                        data : data.data,
                        type : 'facebook'
                    }, function (result) {
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
                    });
                }else{
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
            });
        },

        loginGoogle : function () {
            loginService.doLoginGoogle().then(function (data) {
                if(data.status){
                    loginService.recordData.save({
                        data : data.data,
                        type : 'google'
                    }, function (result) {
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
                    })
                }else{
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
            }, function (err) {
                toastAction.show({
                    top : false,
                    bottom : true,
                    left : false,
                    right : true,
                    text : 'Alguma coisa deu errado, tente novamente :(',
                    scope : login
                });
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