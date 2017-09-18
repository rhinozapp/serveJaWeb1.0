/**
 * Created by guiga on 04/02/2017.
 */

angular.module('login', [])
    .controller('loginController', login);

function login(loginService) {
    var login = this;
    login.vars = {};

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
            loginService.signUp(login.vars.email, login.vars.password);
        }
    };

    login.functions.core();
}
