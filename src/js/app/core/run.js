/**
 * Created by guiga on 25/05/2017.
 */

angular
    .module('core')
    .run(function($rootScope, $window, $state, loginService, jwtHelper) {
        $rootScope.$on('$stateChangeStart', function (e, toState) {
            window.scrollTo(0, 0);
            var token = $window.localStorage.token;

            if (token !== undefined) {
                var bool = jwtHelper.isTokenExpired(token);
                if (bool === true) {
                    loginService.doLogout();
                }
            }

            if ((toState.name.indexOf('admin') > -1) && token === undefined) {
                e.preventDefault();
                $state.go('home');
                $window.localStorage.clear();
            }else if (toState.name === 'home' && token !== undefined) {
                e.preventDefault();
                $state.go('admin.requests');
            }
        });
    });