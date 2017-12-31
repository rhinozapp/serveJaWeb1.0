(function(){
"use strict";
/**
 * Created by guiga on 27/08/2017.
 */

var app = angular.module('serveJa',[
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
    'ngAnimate',
    'ngAria',
    'ngMaterial',
    'ngMessages',

    'ngResource',
    'ngLocale',

    'ui.router',
    'ct.ui.router.extras',
    'ui.router.stateHelper',

    'uiRouterStyles',
    'angular-loading-bar',

    'ngCordovaOauth'
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
        $urlRouterProvider.otherwise('/user/mainList');

        $stateProvider
            .state('user', {
                url: '/user',
                abstract: true,
                templateUrl: "templates/app/layout/layout.html",
            })
            .state('user.mainList', {
                url: '/mainList',
                templateUrl: 'templates/modules/mainList/mainList.html',
                controller: 'mainListController',
                controllerAs : 'mainList'
            })
            .state('user.profile', {
                url: '/profile',
                templateUrl: 'templates/modules/profile/profile.html',
                controller: 'profileController',
                controllerAs : 'profile'
            })

            .state('login', {
                url: '/login',
                templateUrl: 'templates/modules/login/login.html',
                controller: 'loginController',
                controllerAs: 'login',
            });

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
            .primaryPalette('indigo', {
                'default' : '900'
            })
            .accentPalette('orange', {
                'default' : '900'
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
            host : 'http://192.168.1.105:80/'
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