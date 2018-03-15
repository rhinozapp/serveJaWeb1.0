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

    'angular-jwt',

    'ngCordovaOauth',

    'benharold.haversine'
]);

})();
(function(){
"use strict";
angular
    .module('core')
    .directive('googleplace', function() {
        return {
            require: 'ngModel',
            replace: true,
            scope: {
                ngModel: '=',
                geo: '=',
                onSelect: '&?'
            },
            link: function(scope, element, attrs, model) {
                var autocomplete = new google.maps.places.Autocomplete(element[0], {
                    types: [],
                    componentRestrictions: {
                        country: 'br'
                    }
                });

                scope.geo = autocomplete;
                google.maps.event.addListener(autocomplete, 'place_changed', function() {
                    scope.$apply(function() {
                        model.$setViewValue(element.val());
                    });
                });
            }
        };
    });
})();
(function(){
"use strict";
angular
    .module('core')
    .service('defineHost', function () {
        return {
            host : /*'http://192.168.1.103'*/''
        };
    });
})();
(function(){
"use strict";
angular
    .module('core')
    .service('externalLink', function () {
        return {
            open : function (option) {
                window.open(option.url, option.target, 'location='+option.location);
            }
        };
    });
})();
(function(){
"use strict";
angular
    .module('core')
    .service('getCoordinates', function () {
        return {
            getPos : function () {
                return new Promise(function (success) {
                    if(window.navigator && window.navigator.geolocation){
                        window.navigator.geolocation.getCurrentPosition(function (data) {
                            success({
                                lat : data.coords.latitude,
                                long : data.coords.longitude
                            });
                        }, function () {
                            success({
                                lat : '-23.533773',
                                long : '-46.625290'
                            });
                        }, {
                            enableHighAccuracy: true,
                            maximumAge: 0
                        });
                    }else{
                        success({
                            lat : '-23.533773',
                            long : '-46.625290'
                        });
                    }
                });
            }
        }
    });
})();
(function(){
"use strict";
angular
    .module('core')
    .service('getProfile', function ($window, jwtHelper) {
        if($window.localStorage.token){
            var profile = jwtHelper.decodeToken($window.localStorage.token);
            return {
                id : profile.id,
                emailFace: profile.emailFace,
                emailGoogle: profile.emailGoogle,
                name : profile.name,
                photo : profile.photo,
                tokenFace : profile.tokenFace,
                tokenGoogle : profile.tokenGoogle,
                idFace : profile.idFace,
                idGoogle : profile.idGoogle,
                status : true
            }
        }else{
            return {
                status : false
            }
        }

    });
})();
(function(){
"use strict";
angular
    .module('core')
    .service('getRequestStatus', function ($resource, defineHost) {
        return {
            checkRequestStatus : $resource(defineHost.host + '/app/checkRequestStatus')
        }
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
    .service('saveLastAction', function ($window) {
        return {
            save: function(obj) {
                $window.localStorage.lastAction = JSON.stringify(obj);
            },

            get : function () {
                var lastAction = {};
                if($window.localStorage.lastAction){
                    lastAction = JSON.parse($window.localStorage.lastAction);
                }else{
                    lastAction = {};
                }

                return {
                    lastAction : lastAction
                };
            },

            clear : function () {
                $window.localStorage.lastAction = null;
                $window.location.reload();
            }
        };
    });
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
                params : {
                    action : ''
                },
                templateUrl: 'templates/modules/mainList/mainList.html',
                controller: 'mainListController',
                controllerAs : 'mainList'
            })

            .state('place', {
                url: '/place',
                params : {
                    place : {}
                },
                templateUrl: 'templates/modules/place/place.html',
                controller: 'placeController',
                controllerAs: 'place',
            })

            .state('placeRequest', {
                url: '/placeRequest',
                params : {
                    place : {},
                    tableID : {},
                    requestID : {}
                },
                templateUrl: 'templates/modules/placeRequest/placeRequest.html',
                controller: 'placeRequestController',
                controllerAs: 'placeRequest',
            })

            .state('QRCodeReader', {
                url: '/QRCodeReader',
                params : {
                    place : {}
                },
                templateUrl: 'templates/modules/QRCodeReader/QRCodeReader.html',
                controller: 'QRCodeReaderController',
                controllerAs: 'QRCodeReader',
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
angular
    .module('core')
    .run(function($rootScope, $window, $state, saveLastAction, getRequestStatus, getProfile) {
        $rootScope.$on('$stateChangeStart', function (e, toState) {
            // Set scroll to 0
            window.scrollTo(0, 0);
            var token = $window.localStorage.token;

            //region Check QRCode
            // if(toState.name !== 'QRCodeReader'){
            //     QRScanner.prepare(function (err, status) {
            //         if(status.scanning){
            //             QRScanner.cancelScan();
            //             QRScanner.hide();
            //         }
            //     });
            // }
            //endregion

            //region Check Last Action
            if (toState.name === 'login' && token !== undefined) {
                e.preventDefault();

                if($window.localStorage.lastAction){
                    var lastAction = saveLastAction.get().lastAction;
                    switch (true){
                        case lastAction.action === 'inRequest':
                            if(getProfile.status){
                                getRequestStatus.checkRequestStatus.save({
                                    userAppID : getProfile.id
                                }, function (data) {
                                    if(data.status){
                                        $state.go('placeRequest', {
                                            place : data.place,
                                            tableID : data.tableID,
                                            requestID : data.requestID
                                        });
                                    }
                                })
                            }
                            break;

                        case lastAction.action === 'initRequest':
                            if(getProfile.status){
                                getRequestStatus.checkRequestStatus.save({
                                    userAppID : getProfile.id
                                }, function (data) {
                                    if(data.status){
                                        $state.go('placeRequest', {
                                            place : data.place
                                        });
                                    }else{
                                        $state.go('QRCodeReader', {
                                            place : {
                                                pubData : lastAction.data.pubData,
                                                userLocal : {
                                                    lat : lastAction.data.userLocal.lat,
                                                    long : lastAction.data.userLocal.long
                                                }
                                            }
                                        });
                                    }
                                })
                            }else{
                                $state.go('QRCodeReader', {
                                    place : {
                                        pubData : lastAction.data.pubData,
                                        userLocal : {
                                            lat : lastAction.data.userLocal.lat,
                                            long : lastAction.data.userLocal.long
                                        }
                                    }
                                });
                            }
                            break;
                    }
                }else{
                    $state.go('user.mainList');
                }
            }
            //endregion

            //region Get Request Status
            if(getProfile.status){
                getRequestStatus.checkRequestStatus.save({
                    userAppID : getProfile.id
                }, function (data) {
                    if(data.status){
                        $state.go('placeRequest', {
                            place : data.place,
                            tableID : data.tableID,
                            requestID : data.requestID
                        });
                    }
                })
            }
            //endregion
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

function headerController(loginService, $mdSidenav, getProfile) {
    var header = this;
    header.vars = {};

    header.functions = {
        core : function () {
            header.functions.defineVars();
        },

        defineVars : function () {
            header.vars.profile = getProfile;
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