/**
 * Created by guiga on 27/08/2017.
 */

angular
    .module('core')
    .run(function($rootScope, $window, $state) {
        $rootScope.$on('$stateChangeStart', function (e, toState) {
            // Set scroll to 0
            window.scrollTo(0, 0);
            var userUID = $window.localStorage.userUID;

            if ((toState.name.indexOf('mainList') > -1) && userUID === undefined) {
                e.preventDefault();
                $state.go('login');
                $window.localStorage.clear();
            }else if (toState.name === 'login' && userUID !== undefined) {
                e.preventDefault();
                $state.go('user.mainList');
            }
        });
    });