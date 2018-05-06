/**
 * Created by guiga on 25/05/2017.
 */

angular.module('home')
    .service('loginService', loginService)
    .factory('authInterceptor', authInterceptor)
    .config(function($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    });

function loginService($window, $resource, defineHost) {
    return {
        signUP: $resource(defineHost.host + '/web/signUp'),
        usernameValidation: $resource(defineHost.host + '/web/usernameValidation'),
        doLogin: $resource(defineHost.host + '/web/doLogin'),
        doLogout: function() {
            $window.localStorage.clear();
            $window.location.reload();
        }
    }
}

function authInterceptor($q, $window) {
    return {
        request: function(config) {
            config.headers = config.headers || {};

            if ($window.localStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
            }
            return config;
        },
        response: function(response) {
            if (response.status === 401) {
                console.log('denied');
            }
            return response || $q.when(response);
        }
    };
}