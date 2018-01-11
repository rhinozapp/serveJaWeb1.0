(function(){
"use strict";
angular.module('modules', [
    'login',
    'mainList',
    'place'
]);

})();
(function(){
"use strict";
/**
 * Created by guiga on 04/02/2017.
 */

angular.module('login', [])
    .controller('loginController', login);

function login(loginService, $window, toastAction) {
    var login = this;
    login.vars = {};

    login.functions = {
        core : function () {},

        loginFacebook : function () {
            loginService.doLoginFacebook().then(function (data) {
                loginService.recordData.save(data, function (result) {
                    switch (true){
                        case result.status === true:
                            login.vars.message = 'Logado! :)';
                            $window.localStorage.token = result.token;
                            $window.location.reload();
                            break;

                        case result.status === false:
                            login.vars.message = 'Alguma coisa deu errado, tente novamente :(';
                            break;

                        default:
                            login.vars.message = 'Alguma coisa deu errado, tente novamente :(';
                    }

                    toastAction.show({
                        top : false,
                        bottom : true,
                        left : false,
                        right : true,
                        text : login.vars.message,
                        scope : login
                    });
                })
            });
        },

        loginHack : function () {
            loginService.doLoginHack.save({}, function (result) {
                $window.localStorage.token = result.token;
                $window.location.reload();
            })
        }
    };

    login.functions.core();
}
})();
(function(){
"use strict";
/**
 * Created by guiga on 01/09/2017.
 */

angular.module('login')
    .service('loginService', loginService)
    .factory('authInterceptor', authInterceptor)
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    });

function loginService($window, dialogAlert, $resource, defineHost, $cordovaOauth, $http) {
    return {
        doLoginFacebook: function () {
            return $cordovaOauth.facebook('262613364247603', ['public_profile']).then(function(result) {
                return $http.get('https://graph.facebook.com/v2.11/me', {
                    params: {
                        access_token: result.access_token,
                        fields: 'name,picture,email',
                        format: 'json'
                    }
                }).success(function (data, status, headers, config) {
                    return {
                        dataFacebook : data,
                        token : result.access_token
                    };
                }).error(function (error) {
                    dialogAlert.show({
                        title : 'Atenção!',
                        content : error,
                        ok : 'OK!'
                    });
                });

            }, function(error) {
                dialogAlert.show({
                    title : 'Atenção!',
                    content : error,
                    ok : 'OK!'
                });
            });
        },

        doLoginHack : $resource(defineHost.host + '/app/doLoginHack'),

        recordData : $resource(defineHost.host + '/app/doLogin'),

        doLogout : function () {
            $window.localStorage.clear();
            $window.location.reload();
        },
    };
}

function authInterceptor($q, $window) {
    return {
        request: function (config) {
            config.headers = config.headers || {};

            if ($window.localStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
            }
            return config;
        },
        response: function (response) {
            if (response.status === 401) {
                console.log('denied');
            }
            return response || $q.when(response);
        }
    };
}
})();
(function(){
"use strict";
angular.module('mainList', [])
    .controller('mainListController', mainListController);

function mainListController(loginService, getCoordinates, mainListService, haversine, $scope, $filter, $stateParams, getProfile) {
    var mainList = this;
    mainList.vars = {};

    mainList.functions = {
        core : function () {
            mainList.functions.defineVars();
            mainList.functions.checkParams();
            mainList.functions.search();
        },

        defineVars : function () {
            mainList.vars.profile = getProfile;
        },

        checkParams : function () {
            if($stateParams.action.length === 0 || $stateParams.action === 'nearToMe'){
                getCoordinates.getPos().then(function (data) {
                    mainList.vars.lat = data.lat;
                    mainList.vars.long = data.long;

                    mainList.functions.getList.getNear();
                });
            }else if($stateParams.action === 'favorites'){
                mainList.functions.getList.getFavorite();

            }else if($stateParams.action === 'findLocal'){
                mainList.vars.actionFindLocal = true;
            }
        },

        search : function () {
            $scope.$watch('mainList.vars.search', function (newvalue, oldvalue) {
                if(newvalue < oldvalue){
                    mainList.vars.listFilter = mainList.vars.list
                }else{
                    mainList.vars.listFilter = $filter('filter')(mainList.vars.list, {
                        name : newvalue
                    });
                }
            });
        },

        getList : {
            getNear : function () {
                mainListService.get.save({
                    lat : mainList.vars.lat,
                    long : mainList.vars.long
                }, mainList.functions.getList.success)
            },

            getFavorite : function () {},

            success : function (data) {
                mainList.vars.list = data.data;
                angular.forEach(mainList.vars.list, function (value) {
                    value.distance = haversine({
                        latitude : mainList.vars.lat,
                        longitude : mainList.vars.long
                    }, {
                        latitude : value.loc.coordinates[1],
                        longitude : value.loc.coordinates[0]
                    }, {unit: 'km'});
                });

                mainList.vars.listFilter = mainList.vars.list;
            }
        },

        logout : function () {
            loginService.doLogout();
        }
    };

    mainList.functions.core();
}

})();
(function(){
"use strict";
angular.module('mainList')
    .service('mainListService', mainListService);

function mainListService($resource, defineHost) {
    return {
        get : $resource(defineHost.host + '/app/getListPubs')
    }
}
})();
(function(){
"use strict";
angular.module('place', [])
    .controller('placeController', placeController);

function placeController($stateParams, placeService){
    var place = this;
    place.vars = {};

    place.vars = $stateParams;
}
})();
(function(){
"use strict";
angular.module('place')
    .service('placeService', placeService);

function placeService($resource, defineHost) {
    return {
        get : $resource(/*defineHost.host + */'/app/getListPubs')
    }
}
})();