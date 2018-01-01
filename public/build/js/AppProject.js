(function(){
"use strict";
angular
    .module('serveJa', [
        // Ordem não importa.
        'core',
        'layout',
        'modules'
    ]);
})();
(function(){
"use strict";
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
    'ui.mask',
    'ngCpfCnpj',

    'angular-jwt',

    'ngFileUpload',

    'md.data.table'

    /*
    'permission',
    'permission.ui',

    'ngclipboard',
    'daterangepicker',
    'chart.js',

    'angulartics',
    'angulartics.google.analytics'*/
]);


})();
(function(){
"use strict";
/**
 * Created by guiga on 28/05/2017.
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
 * Created by guiga on 13/05/2017.
 */
angular
    .module('core')
	.config(function ($stateProvider, $urlRouterProvider, $locationProvider, stateHelperProvider) {
        //region URLPROVIDER
        $urlRouterProvider.otherwise('/home');

        $urlRouterProvider.when('/admin', '/admin/profile');
        $urlRouterProvider.when('/home', '/');
        //endregion

        stateHelperProvider
            .state({
                name: 'home',
                url: '/',
                controller: 'homeController',
                controllerAs: 'home',
                templateUrl: 'templates/modules/home/home.html',
                /*data: {
                    css: 'build/css/home.css'
                },
                children: []*/
            })
            .state({
                name : 'recoveryPassword',
                url: '/recoveryPassword/:q',
                controller: 'recoveryPasswordController',
                controllerAs : 'recoveryPassword',
                templateUrl: 'templates/modules/recoveryPassword/recoveryPassword.html'
            })
			.state({
                name: 'admin',
                url: '/admin',
                abstract: true,
                templateUrl: "templates/app/layout/layout.html",
                children: [
                    //region Main Control
                    {
                        name: 'mainControl',
                        url: '/mainControl',
                        controller: 'mainControlController',
                        controllerAs: 'mainControl',
                        templateUrl: 'templates/modules/mainControl/mainControl.html'
                    },
                    //endregion

                    //region Profile
                    {
                        name: 'profile',
                        url: '/profile',
                        controller: 'profileController',
                        controllerAs: 'profile',
                        templateUrl: 'templates/modules/profile/profile.html'
                    },
                    //endregion

                    //region Profile
                    {
                        name: 'products',
                        url: '/products',
                        controller: 'productsController',
                        controllerAs: 'products',
                        templateUrl: 'templates/modules/products/products.html'
                    },
                    //endregion

                    //region Menu
                    {
                        name: 'menu',
                        url: '/menu',
                        controller: 'menuController',
                        controllerAs: 'menu',
                        templateUrl: 'templates/modules/menu/menu.html'
                    },
                    //endregion

                    //region Menu
                    {
                        name: 'tables',
                        url: '/tables',
                        controller: 'tablesController',
                        controllerAs: 'tables',
                        templateUrl: 'templates/modules/tables/tables.html'
                    },
                    //endregion
                ]
			});

        /*$locationProvider.html5Mode(true);*/
	});
})();
(function(){
"use strict";
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
                $state.go('admin.products');
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
            .primaryPalette('grey', {
                'default' : '800'
            })
            .accentPalette('blue')
            .warnPalette('orange');
    });
})();
(function(){
"use strict";
angular
    .module('core')
    .config(['uiMask.ConfigProvider', function(uiMaskConfigProvider) {}]);
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
 * Created by guilherme.assis on 06/12/2016.
 */

angular
    .module('core')
    .service('toastAction', function ($mdToast) {
        return {
            show: function(option){
                var last = {
                    bottom: option.bottom,
                    top: option.top,
                    left: option.left,
                    right: option.right
                };

                option.scope.toastPosition = angular.extend({},last);

                function sanitizePosition() {
                    var current = option.scope.toastPosition;

                    if ( current.bottom && last.top ) current.top = false;
                    if ( current.top && last.bottom ) current.bottom = false;
                    if ( current.right && last.left ) current.left = false;
                    if ( current.left && last.right ) current.right = false;

                    last = angular.extend({},current);
                }


                option.scope.getToastPosition = function() {
                    sanitizePosition();

                    return Object.keys(option.scope.toastPosition)
                        .filter(function(pos) { return option.scope.toastPosition[pos]; })
                        .join(' ');
                };


                var pin = option.scope.getToastPosition();
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(option.text)
                        .position(pin)
                        .hideDelay(3000)
                );
            }
        };
    });
})();
(function(){
"use strict";
angular
    .module('core')
    .service('profileGet', function ($window, jwtHelper) {
        var profile = jwtHelper.decodeToken($window.localStorage.token);
        return {
            id : profile.id,
            email: profile.email,
            name : profile.name,
            logoPath : profile.logoPath
        }
    });
})();
(function(){
"use strict";
angular
    .module('core')
    .directive('setFocus', function ($timeout) {
        return {
            link: function (scope, element, attrs) {
                scope.$watch(attrs.setFocus, function (value) {
                    if (value === true) {
                        $timeout(function () {
                            element[0].focus();
                            scope[attrs.setFocus] = false;
                        });
                    }
                });
            }
        };
    });
})();
(function(){
"use strict";
angular
    .module('core')
    .service('getLatLong', function ($http) {
        return {
            getData : function (zipCode) {
                return new Promise((success => {
                    var results;
                    return $http.get('http://maps.google.com/maps/api/geocode/json?address='+zipCode).then(function (response) {
                        if (response.data.status === 'OK') {
                            results = {
                                lat : response.data.results[0].geometry.location.lat,
                                lng : response.data.results[0].geometry.location.lng,
                                status : response.data.status
                            };

                            success(results);
                        }else{
                            results = {
                                status : false
                            };

                            success(results);
                        }
                    });
                }));

            }
        };
    })
    .service('getAddress', function ($http) {
        return {
            getData : function (zipCode) {
                return new Promise((success => {
                    $http.get("https://viacep.com.br/ws/"+zipCode+"/json/").then(function (response) {
                        success(response.data);
                    });
                }));
            }
        };
    })
    .service('zipCodeSearch', function (getLatLong, getAddress, $resource) {
        return {
            getData : function (allAddress) {
                return new Promise((success => {
                    var results = {};

                    getLatLong.getData(allAddress.zipCode).then(function (data) {
                        results.latlong = data;

                        getAddress.getData(allAddress.zipCode).then(function (data) {
                            results.address = data;

                            success(results);
                        });
                    });
                }));
            },
            getDataBack : $resource('web/zipCode')
        };
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
    .directive('headerNav', headerNav);

function headerNav() {
    return {
        restrict: 'E',
        templateUrl: 'templates/app/layout/headerNav/headerNav.html',
        link: linkFunc,
        controller: 'headerNavController',
        controllerAs: 'headerNav',
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
    .controller('headerNavController', headerNavController);

function headerNavController(loginService, profileGet) {
    var headerNav = this;
    headerNav.vars = {};

    headerNav.functions = {
        core : function () {
            headerNav.functions.profile();
        },

        profile : function () {
            headerNav.vars.userProfile = profileGet;
        },

        doLogout : function () {
            loginService.doLogout();
        }
    };

    headerNav.functions.core();
}
})();