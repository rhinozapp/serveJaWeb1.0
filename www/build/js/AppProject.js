(function(){
"use strict";
/**
 * Created by guiga on 27/08/2017.
 */

var app = angular.module('RhinozApp',[
    'layout',
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
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider, stateHelperProvider) {
        $urlRouterProvider.otherwise('login');
        $locationProvider.html5Mode(false);

        stateHelperProvider
            .state({
                name: 'login',
                url: '/login',
                controller: 'loginController',
                controllerAs: 'login',
                templateUrl: 'templates/modules/login/login.html',
                /*data: {
                    css: 'build/css/login.css'
                },
                children: []*/
            })

            .state({
                name: 'user',
                url: '/user',
                abstract: true,
                templateUrl: "templates/app/layout/layout.html",
                children: [
                    {
                        name: 'mainList',
                        url: '/mainList',
                        controller: 'mainListController',
                        controllerAs : 'mainList',
                        templateUrl: 'templates/modules/mainList/mainList.html'
                    },

                    {
                        name: 'profile',
                        url: '/profile',
                        controller: 'profileController',
                        controllerAs : 'profile',
                        templateUrl: 'templates/modules/profile/profile.html'
                    }
                ]
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
})();
(function(){
"use strict";
/**
 * Created by guiga on 25/05/2017.
 */

angular
    .module('core')
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('yellow', {
                'default' : '400'
            })
            .accentPalette('blue-grey', {
                'default' : '400'
            })
            .warnPalette('orange');

        $mdThemingProvider.enableBrowserColor({
            hue: '200' // Default is '800'
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
(function(){
"use strict";
/**
 * Created by guiga on 25/05/2017.
 */

angular.module('layout', []);
})();
(function(){
"use strict";
/**
 * Created by guiga on 25/05/2017.
 */

angular
    .module('layout')
    .directive('container', container);

function container() {
    return {
        restrict: 'EA',
        template: '<ui-view></ui-view>',
        link: linkFunc,
        bindToController: true
    };
    
    function linkFunc() {}
}
})();
(function(){
"use strict";
/**
 * Created by guiga on 25/05/2017.
 */

angular
    .module('layout')
    .directive('header', header);

function header() {
    return {
        restrict: 'E',
        templateUrl: 'templates/app/layout/header/header.html',
        link: linkFunc,
        controller: 'headerController',
        controllerAs: 'header',
        bindToController: true
    };

    function linkFunc(scope, el, attr, ctrl) {}
}
})();
(function(){
"use strict";
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
})();