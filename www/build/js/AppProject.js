(function(){
"use strict";
/**
 * Created by guiga on 27/08/2017.
 */

var app = angular.module('RhinozApp',[
    'core',
    'modules'
]);
})();
(function(){
"use strict";
/**
 * Created by guiga on 27/08/2017.
 */

angular.module('core', [
    // Dependecies
    'ionic',
    'ngAnimate',
    'ngAria',
    'ngMaterial',
    'ngMessages',

    'ngResource',
    'ngLocale',

    'ngSanitize',

    'ui.router',
    'ct.ui.router.extras',
    'ui.router.stateHelper',

    'uiRouterStyles',
    'angular-loading-bar',

    'firebase'
]);

})();
(function(){
"use strict";
/**
 * Created by Guilherme Assis on 19/09/2016.
 */

angular
	.module('core');

})();
(function(){
"use strict";
/**
 * Created by Michel Costa S on 2/24/2016.
 * @Description: Configurador da barra de carregamento para o Bloo Project inteiro usando as Promises.
 */
angular
	.module('core')
	.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
		cfpLoadingBarProvider.includeSpinner = false;
	}]);

})();
(function(){
"use strict";
/**
 * Created by guilherme.assis on 2/24/2016.
 * @Description: Configuração das Rotas do RhinozApp Project.
 */

angular
    .module('core')
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise('login');
        $locationProvider.html5Mode(false);

        $stateProvider
            .state('login', {
                url: '/login',
                controller: 'loginController',
                controllerAs : 'login',
                templateUrl: 'templates/modules/login/login.html',
                data: {
                    /*css: 'build/css/login.css'*/
                }
            })
            .state('timeLine', {
                url: '/timeLine',
                controller: 'timeLineController',
                controllerAs : 'timeLine',
                templateUrl: 'templates/modules/timeLine/timeLine.html'
            });

        // use the HTML5 History API
        $locationProvider.html5Mode(false);
    });

})();
(function(){
"use strict";
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

            if ((toState.name.indexOf('timeLine') > -1) && userUID === undefined) {
                e.preventDefault();
                $state.go('login');
                $window.localStorage.clear();
            }else if (toState.name === 'login' && userUID !== undefined) {
                e.preventDefault();
                $state.go('timeLine');
            }
        });
    });
})();
(function(){
"use strict";
angular
    .module('core')
    .service('defineHost', function () {
        return {
            host : 'http://localhost:80/'
        };
    });
})();
(function(){
"use strict";
/**
 * Created by guilherme.assis on 02/12/2016.
 */
angular
    .module('core')
    .service('dialogAlert', function ($mdDialog) {
        return {
            show: function(option){
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .clickOutsideToClose(true)
                        .title(option.title)
                        .textContent(option.content)
                        .ariaLabel('dialog')
                        .ok(option.ok)
                )
            }
        };
    })
    .service('dialogAdvanced', function ($mdMedia, $mdDialog) {
        return {
            show : function (options) {
                var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
                $mdDialog.show({
                    controller: options.controller,
                    controllerAs: options.controllerAs,
                    templateUrl: options.templateUrl,
                    parent: angular.element(document.body),
                    clickOutsideToClose:options.clickOutsideToClose,
                    fullscreen: useFullScreen,
                    locals : {
                        data : options.dataToDialog
                    }
                }).then(options.functionThen);
            },

            cancel : function () {
                $mdDialog.cancel();
            },

            hide : function (result) {
                $mdDialog.hide(result);
            }
        }
    })
    .service('dialogConfirm', function ($mdDialog) {
        return {
            show : function (options) {
                var confirm = $mdDialog.confirm()
                    .title(options.title)
                    .textContent(options.textContent)
                    .ariaLabel('confirm')
                    .ok(options.ok)
                    .cancel(options.cancel);

                $mdDialog.show(confirm).then(options.confirmFunction, options.cancelFunction);
            }
        }
    });
})();