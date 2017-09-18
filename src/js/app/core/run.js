/**
 * Created by guiga on 27/08/2017.
 */

angular
    .module('core')
    .run(function($ionicPlatform, $rootScope, $window, $state) {
        $ionicPlatform.ready(function() {
            if(window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if(window.StatusBar) {
                StatusBar.styleDefault();
            }
        });

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