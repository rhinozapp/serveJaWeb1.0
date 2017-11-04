/**
 * Created by guiga on 25/05/2017.
 */

angular.module('login')
    .service('loginService', loginService);

function loginService($window, dialogAlert, $resource) {
    return {
        signUP : $resource('web/signUp'),

        doLogin: $resource('web/doLogin'),

        doLogout : function () {}
    }
}