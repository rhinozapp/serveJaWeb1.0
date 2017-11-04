/**
 * Created by guiga on 04/02/2017.
 */

angular.module('mainList', [])
    .controller('mainListController', mainListController);

function mainListController(loginService) {
    var mainList = this;

    mainList.vars = {};

    mainList.functions = {
        core : function () {},

        logout : function () {
            loginService.doLogout();
        }
    };

    mainList.functions.core();
}
