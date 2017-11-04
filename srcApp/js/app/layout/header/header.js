/**
 * Created by guiga on 25/05/2017.
 */

angular
    .module('layout')
    .controller('headerController', headerController);

function headerController(loginService, $mdSidenav) {
    var header = this;
    header.vars = {};

    header.functions = {
        core : function () {},

        doLogout : function () {
            loginService.doLogout();
        },
        
        openNav : function () {
            header.functions.buildToggler('left');
            $mdSidenav('left').isOpen();
        },

        buildToggler : function (navID) {
            $mdSidenav(navID)
                .toggle()
                .then(function () {});
        },

        closeNav : function () {
            $mdSidenav('left')
                .close()
                .then(function () {});
        }
    };

    header.functions.core();
}