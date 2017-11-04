(function(){
"use strict";
angular
    .module('RhinozApp', [
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

    /*
    'permission',
    'permission.ui',
    'angular-jwt',

    'md.data.table',

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

        $urlRouterProvider.when('/admin', '/admin/mainControl');
        $urlRouterProvider.when('/home', '/');
        //endregion

        stateHelperProvider
            .state({
                name: 'home',
                url: '/',
                controller: 'homeController',
                controllerAs: 'home',
                templateUrl: 'templates/modules/home/home.html'
                /*data: {
                    css: 'build/css/home.css'
                },
                children: []*/
            })

            .state({
                name: 'login',
				url: '/login',
				controller: 'loginController',
				controllerAs: 'login',
				templateUrl: 'templates/modules/login/login.html',
                data: {
                    css: 'build/css/login.css'
                },
                children: []
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
    .run(function($rootScope, $window, $state) {
        $rootScope.$on('$stateChangeStart', function (e, toState) {
            window.scrollTo(0, 0);
            var userUID = $window.localStorage.userUID;
            if ((toState.name.indexOf('admin') > -1) && userUID === undefined) {
                e.preventDefault();
                $state.go('login');
                $window.localStorage.clear();
            }else if (toState.name === 'login' && userUID !== undefined) {
                e.preventDefault();
                $state.go('admin.mainControl');
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
            .primaryPalette('blue', {
                'default' : '800'
            })
            .accentPalette('teal')
            .warnPalette('orange');
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
    .service('zipCodeSearch', function (getLatLong, getAddress) {
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
            }
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

function headerController(loginService, $mdSidenav, profileGet) {
    var header = this;
    header.vars = {};

    header.functions = {
        core : function () {
            header.functions.profile();
        },

        profile : function () {
            header.vars.userProfile = profileGet.currentUser;
        },

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