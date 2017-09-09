/**
 * Created by guiga on 04/02/2017.
 */

angular.module('timeLine', [])
    .controller('timeLineController', timeLine);

function timeLine(loginService) {
    var timeLine = this;
    timeLine.vars = {};

    timeLine.functions = {
        core : function () {},

        logout : function () {
            loginService.doLogout();
        }
    };

    timeLine.functions.core();
}
