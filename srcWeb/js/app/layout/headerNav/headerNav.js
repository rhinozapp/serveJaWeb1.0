/**
 * Created by guiga on 25/05/2017.
 */

angular
    .module('layout')
    .controller('headerNavController', headerNavController);

function headerNavController(loginService, profileGet) {
    var headerNav = this;
    headerNav.vars = {};

    headerNav.functions = {
        core : function () {
            headerNav.functions.profile();
        },

        profile : function () {
            headerNav.vars.userProfile = profileGet;
        },

        doLogout : function () {
            loginService.doLogout();
        }
    };

    headerNav.functions.core();
}