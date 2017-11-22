/**
 * Created by guiga on 25/05/2017.
 */

angular
    .module('layout')
    .controller('headerController', headerController);

function headerController(loginService, profileGet) {
    var header = this;
    header.vars = {};

    header.functions = {
        core : function () {
            header.functions.profile();
        },

        profile : function () {
            header.vars.userProfile = profileGet;
        },

        doLogout : function () {
            loginService.doLogout();
        }
    };

    header.functions.core();
}