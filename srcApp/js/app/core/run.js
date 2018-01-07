angular
    .module('core')
    .run(function($rootScope, $window, $state) {
        $rootScope.$on('$stateChangeStart', function (e, toState) {
            // Set scroll to 0
            window.scrollTo(0, 0);
            var token = $window.localStorage.token;

            if (toState.name === 'login' && token !== undefined) {
                e.preventDefault();
                $state.go('user.mainList');
            }
        });
    });