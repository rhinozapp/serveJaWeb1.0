/**
 * Created by guiga on 04/02/2017.
 */

angular.module('login', [])
    .controller('loginController', login);

function login(loginService, dialogAlert, dialogConfirm, $cordovaOauth) {
    var login = this;
    login.vars = {};

    //This working!
    $cordovaOauth.facebook('262613364247603', ['public_profile']).then(function(result) {
        dialogAlert.show({
            title : 'Atenção!',
            content : JSON.stringify(result),
            ok : 'OK!'
        });

    }, function(error) {
        dialogAlert.show({
            title : 'Atenção!',
            content : error,
            ok : 'OK!'
        });
    });

    login.functions = {
        core : function () {},

        loginEmail : function () {
            loginService.doLoginEmail(login.vars.email, login.vars.password);
        },

        resetPassword : function () {
            loginService.resetPassword(login.vars.email);
        },

        loginFacebook : function () {
            loginService.doLoginFacebook();
        },

        signUp : function () {
            console.log(login.vars.email);

            if(!login.vars.email){
                dialogAlert.show({
                    title : 'Atenção!',
                    content : 'Digite um e-mail e uma senha no formulário para se cadastrar',
                    ok : 'OK!'
                });
            }else{
                dialogConfirm.show({
                    title : 'Atenção!',
                    textContent : 'Deseja se cadastrar com o e-mail ' + login.vars.email + '?',
                    ok : 'Sim!',
                    cancel : 'Cancelar',
                    confirmFunction : function () {
                        loginService.signUp(login.vars.email, login.vars.password);
                    },
                    cancelFunction : function () {
                        dialogAlert.show({
                            title : 'Sem problemas :)',
                            content : 'Volte sempre para aproveitar o melhor de nossos serviços',
                            ok : 'OK!'
                        });
                    }
                });
            }
        }
    };

    login.functions.core();
}