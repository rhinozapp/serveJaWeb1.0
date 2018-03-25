(function(){
"use strict";
angular.module('modules', [
    'login',
    'mainList',
    'place',
    'placeRequest',
    'QRCodeReader'
]);

})();
(function(){
"use strict";
angular.module('QRCodeReader', [])
    .controller('QRCodeReaderController', QRCodeReaderController);

function QRCodeReaderController($stateParams, $state, getProfile, toastAction, saveLastAction, QRCodeReaderService) {
    var QRCodeReader = this;
    QRCodeReader.vars = {};

    QRCodeReader.functions = {
        core : function () {
            QRCodeReader.functions.initScan();
        },

        initScan : function () {
            if(getProfile.status){
                QRScanner.scan(function (err, tableID){
                    if(err){
                        toastAction.show({
                            top : false,
                            bottom : true,
                            left : false,
                            right : true,
                            text : 'Scan finalizado.',
                            scope : QRCodeReader
                        });
                        QRScanner.cancelScan();
                        QRScanner.hide();
                    } else {
                        QRCodeReader.functions.checkValidTable.checkValidTable(tableID);
                    }
                });
                QRScanner.show(function(status){});
            }else{
                toastAction.show({
                    top : false,
                    bottom : true,
                    left : false,
                    right : true,
                    text : 'É necessário realizar o login antes de iniciar o pedido',
                    scope : QRCodeReader
                });
                saveLastAction.save({
                    module : 'placeRequest',
                    data : $stateParams.place,
                    action : 'initRequest'
                });
                $state.go('login');
            }
        },

        checkValidTable : {
            checkValidTable : function (tableID) {
                QRCodeReader.vars.tableID = tableID;
                QRCodeReaderService.checkTableValid.save({
                    place : $stateParams.place,
                    tableID : QRCodeReader.vars.tableID
                }, QRCodeReader.functions.checkValidTable.successCheckValidTable);
            },

            successCheckValidTable : function (data) {
                if(data.status){
                    QRCodeReader.functions.checkValidTable.startRequest();
                }else{
                    toastAction.show({
                        top : false,
                        bottom : true,
                        left : false,
                        right : true,
                        text : 'Essa mesa nao pertence a este bar, tente novamente',
                        scope : QRCodeReader
                    });

                    QRCodeReader.functions.initScan();
                }
            },

            startRequest : function () {
                QRCodeReaderService.startRequest.save({
                    place : $stateParams.place,
                    tableID : QRCodeReader.vars.tableID,
                    userAppID: getProfile.id
                }, QRCodeReader.functions.checkValidTable.successStartRequest)
            },

            successStartRequest : function (data) {
                QRScanner.cancelScan();
                QRScanner.hide();

                if(data.status){
                    toastAction.show({
                        top : false,
                        bottom : true,
                        left : false,
                        right : true,
                        text : 'Seu pedido começou! Escolha os produtos e aproveite!',
                        scope : QRCodeReader
                    });
                    saveLastAction.save({
                        module : 'placeRequest',
                        data : $stateParams.place,
                        action : 'inRequest'
                    });
                    $state.go('placeRequest', {
                        place : $stateParams.place
                    });

                }else{
                    toastAction.show({
                        top : false,
                        bottom : true,
                        left : false,
                        right : true,
                        text : 'Algo deu errado, tente novamente',
                        scope : QRCodeReader
                    });

                    QRCodeReader.functions.initScan();
                }
            }
        },

        cancelScan : function () {
            QRScanner.cancelScan();
            QRScanner.hide();
            $state.go('user.mainList');
        }
    };

    QRCodeReader.functions.core();
}
})();
(function(){
"use strict";
angular.module('QRCodeReader')
    .service('QRCodeReaderService', QRCodeReaderService);

function QRCodeReaderService($resource, defineHost) {
    return {
        checkTableValid : $resource(defineHost.host + '/app/checkTableValid'),
        startRequest : $resource(defineHost.host + '/app/startRequest')
    }
}
})();
(function(){
"use strict";
angular.module('login', [])
    .controller('loginController', login);

function login(loginService, $window, toastAction) {
    var login = this;
    login.vars = {};

    login.functions = {
        core : function () {},

        loginFacebook : function () {
            loginService.doLoginFacebook().then(function (data) {
                if(data.status){
                    loginService.recordData.save({
                        data : data.data,
                        type : 'facebook'
                    }, function (result) {
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
                    });
                }else{
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
            });
        },

        loginGoogle : function () {
            loginService.doLoginGoogle().then(function (data) {
                if(data.status){
                    loginService.recordData.save({
                        data : data.data,
                        type : 'google'
                    }, function (result) {
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
                    })
                }else{
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
            }, function (err) {
                toastAction.show({
                    top : false,
                    bottom : true,
                    left : false,
                    right : true,
                    text : 'Alguma coisa deu errado, tente novamente :(',
                    scope : login
                });
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
                    return {
                        status : false
                    };
                });

            }, function(error) {
                return {
                    status : false
                };
            });
        },

        doLoginGoogle : function () {
            return new Promise(function(success){
                window.plugins.googleplus.login(
                    {
                        'scopes': '',
                        'webClientId': '675857416832-gkkntadhdgbjs8o19akb071ho7stguki.apps.googleusercontent.com',
                        'offline': true
                    },
                    function (obj) {
                        success({
                            status : true,
                            data : JSON.stringify(obj)
                        });
                    },
                    function (msg) {
                        success({
                            status : false,
                            data : msg
                        });
                    }
                );
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

function mainListController(loginService, getCoordinates, mainListService, haversine, $scope, $filter, $stateParams, getProfile, $state, dialogAlert) {
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
                getCoordinates.getPos().then(function (data) {
                    mainList.vars.lat = data.lat;
                    mainList.vars.long = data.long;

                    mainList.functions.getList.getFavorite();
                });

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
                mainList.vars.nearLocal = 'Próximos à seu local.';
                mainList.vars.latSearch = mainList.vars.lat;
                mainList.vars.longSearch = mainList.vars.long;
                mainListService.getListPubs.save({
                    lat : mainList.vars.lat,
                    long : mainList.vars.long
                }, mainList.functions.getList.success);
            },

            getLocal : function () {
                if(mainList.vars.geo.getPlace() && mainList.vars.searchLocal.length > 0){
                    mainList.vars.list = [];
                    mainList.vars.latSearch = mainList.vars.geo.getPlace().geometry.location.lat();
                    mainList.vars.longSearch = mainList.vars.geo.getPlace().geometry.location.lng();
                    mainList.vars.nearLocal = 'Próximos à ' + mainList.vars.searchLocal;
                    mainList.vars.search = '';
                    mainListService.getListPubs.save({
                        lat : mainList.vars.geo.getPlace().geometry.location.lat(),
                        long : mainList.vars.geo.getPlace().geometry.location.lng()
                    }, mainList.functions.getList.success);
                }
            },

            getFavorite : function () {
                mainList.vars.nearLocal = 'Seus favoritos.';
                mainList.vars.latSearch = mainList.vars.lat;
                mainList.vars.longSearch = mainList.vars.long;
                mainListService.getListPubsFavorites.save({
                    userID : getProfile.id
                }, mainList.functions.getList.success);
            },

            success : function (data) {
                mainList.vars.list = data.data;

                angular.forEach(mainList.vars.list, function (value) {
                    //region Distance
                    value.distance = haversine({
                        latitude : mainList.vars.latSearch,
                        longitude : mainList.vars.longSearch
                    }, {
                        latitude : value.loc.coordinates[1],
                        longitude : value.loc.coordinates[0]
                    }, {unit: 'km'});
                    //endregion

                    //region Define open or close pub
                    switch (true){
                        case moment().weekday() === 0:
                            if(value.sunday.status){
                                if(value.sunday.timeStart === value.sunday.timeEnd){
                                    value.openToday = true;
                                    value.openAllDay = true;
                                    value.timeStart = value.sunday.timeStart;
                                    value.timeEnd = value.sunday.timeEnd;
                                }else{

                                    if(moment().isBetween(moment(value.sunday.timeStart, "HH:mm") , moment(value.sunday.timeEnd, "HH:mm a"))){
                                        value.openToday = true;
                                        value.openAllDay = false;
                                        value.timeStart = value.sunday.timeStart;
                                        value.timeEnd = value.sunday.timeEnd;
                                    }else{
                                        value.openToday = false;
                                    }
                                }
                            }else{
                                value.openToday = false;
                            }
                            break;

                        case moment().weekday() === 1:
                            if(value.monday.status){
                                if(value.monday.timeStart === value.monday.timeEnd){
                                    value.openToday = true;
                                    value.openAllDay = true;
                                    value.timeStart = value.monday.timeStart;
                                    value.timeEnd = value.monday.timeEnd;
                                }else{

                                    if(moment().isBetween(moment(value.monday.timeStart, "HH:mm") , moment(value.monday.timeEnd, "HH:mm a"))){
                                        value.openToday = true;
                                        value.openAllDay = false;
                                        value.timeStart = value.monday.timeStart;
                                        value.timeEnd = value.monday.timeEnd;
                                    }else{
                                        value.openToday = false;
                                    }
                                }
                            }else{
                                value.openToday = false;
                            }
                            break;

                        case moment().weekday() === 2:
                            if(value.tuesday.status){
                                if(value.tuesday.timeStart === value.tuesday.timeEnd){
                                    value.openToday = true;
                                    value.openAllDay = true;
                                    value.timeStart = value.tuesday.timeStart;
                                    value.timeEnd = value.tuesday.timeEnd;
                                }else{

                                    if(moment().isBetween(moment(value.tuesday.timeStart, "HH:mm") , moment(value.tuesday.timeEnd, "HH:mm a"))){
                                        value.openToday = true;
                                        value.openAllDay = false;
                                        value.timeStart = value.tuesday.timeStart;
                                        value.timeEnd = value.tuesday.timeEnd;
                                    }else{
                                        value.openToday = false;
                                    }
                                }
                            }else{
                                value.openToday = false;
                            }
                            break;

                        case moment().weekday() === 3:
                            if(value.wednesday.status){
                                if(value.wednesday.timeStart === value.wednesday.timeEnd){
                                    value.openToday = true;
                                    value.openAllDay = true;
                                    value.timeStart = value.wednesday.timeStart;
                                    value.timeEnd = value.wednesday.timeEnd;
                                }else{

                                    if(moment().isBetween(moment(value.wednesday.timeStart, "HH:mm") , moment(value.wednesday.timeEnd, "HH:mm a"))){
                                        value.openToday = true;
                                        value.openAllDay = false;
                                        value.timeStart = value.wednesday.timeStart;
                                        value.timeEnd = value.wednesday.timeEnd;
                                    }else{
                                        value.openToday = false;
                                    }
                                }
                            }else{
                                value.openToday = false;
                            }
                            break;

                        case moment().weekday() === 4:
                            if(value.thursday.status){
                                if(value.thursday.timeStart === value.thursday.timeEnd){
                                    value.openToday = true;
                                    value.openAllDay = true;
                                    value.timeStart = value.thursday.timeStart;
                                    value.timeEnd = value.thursday.timeEnd;
                                }else{

                                    if(moment().isBetween(moment(value.thursday.timeStart, "HH:mm") , moment(value.thursday.timeEnd, "HH:mm a"))){
                                        value.openToday = true;
                                        value.openAllDay = false;
                                        value.timeStart = value.thursday.timeStart;
                                        value.timeEnd = value.thursday.timeEnd;
                                    }else{
                                        value.openToday = false;
                                    }
                                }
                            }else{
                                value.openToday = false;
                            }
                            break;

                        case moment().weekday() === 5:
                            if(value.friday.status){
                                if(value.friday.timeStart === value.friday.timeEnd){
                                    value.openToday = true;
                                    value.openAllDay = true;
                                    value.timeStart = value.friday.timeStart;
                                    value.timeEnd = value.friday.timeEnd;
                                }else{

                                    if(moment().isBetween(moment(value.friday.timeStart, "HH:mm") , moment(value.friday.timeEnd, "HH:mm a"))){
                                        value.openToday = true;
                                        value.openAllDay = false;
                                        value.timeStart = value.friday.timeStart;
                                        value.timeEnd = value.friday.timeEnd;
                                    }else{
                                        value.openToday = false;
                                    }
                                }
                            }else{
                                value.openToday = false;
                            }
                            break;

                        default:
                            if(value.saturday.status){
                                if(value.saturday.timeStart === value.saturday.timeEnd){
                                    value.openToday = true;
                                    value.openAllDay = true;
                                    value.timeStart = value.saturday.timeStart;
                                    value.timeEnd = value.saturday.timeEnd;
                                }else{

                                    if(moment().isBetween(moment(value.saturday.timeStart, "HH:mm") , moment(value.saturday.timeEnd, "HH:mm a"))){
                                        value.openToday = true;
                                        value.openAllDay = false;
                                        value.timeStart = value.saturday.timeStart;
                                        value.timeEnd = value.saturday.timeEnd;
                                    }else{
                                        value.openToday = false;
                                    }
                                }
                            }else{
                                value.openToday = false;
                            }
                    }
                    //endregion
                });

                mainList.vars.listFilter = mainList.vars.list;
            },
        },

        goPub : function (data) {
            if(data.openToday){
                $state.go('place', {
                    place : {
                        pubData : data,
                        userLocal : {
                            lat : mainList.vars.latSearch,
                            long : mainList.vars.longSearch
                        }
                    }
                });
            }else{
                dialogAlert.show({
                    title : 'Que pena!',
                    content : 'Não estamos abertos hoje :(',
                    ok : 'OK'
                });
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
        getListPubs : $resource(defineHost.host + '/app/getListPubs'),
        getListPubsFavorites : $resource(defineHost.host + '/app/getListPubsFavorites')
    }
}
})();
(function(){
"use strict";
angular.module('place', [])
    .controller('placeController', placeController);

function placeController($stateParams, $state, placeService, mainListService, externalLink, getProfile){
    var place = this;
    place.vars = {};

    place.functions = {
        core : function () {
            place.functions.defineVars().then(function () {
                place.functions.getCategory.getCategory();
                place.functions.defineMenu();
                place.functions.getMenu.getMenu();
                place.functions.checkFavorite.checkFavorite();

                }, function () {
                $state.go('user.mainList');
            });
        },

        defineVars : function () {
            return new Promise(function (success, fail) {
                place.vars.showHowToArrive = false;
                if($stateParams.place.pubData){
                    place.vars.dataPub = $stateParams.place.pubData;
                    place.vars.userLat = $stateParams.place.userLocal.lat;
                    place.vars.userLong = $stateParams.place.userLocal.long;
                    place.vars.listByCategory = [];
                    place.vars.listPromotion = [];
                    place.vars.statusUser = getProfile.status;
                    success();
                }else{
                    fail();
                }
            });
        },

        externalLink : function (url, target, location) {
            externalLink.open({
                url : url,
                target : target,
                location : location
            });
        },

        defineMenu : function () {
            switch (true) {
                case moment().weekday() === 0:
                    place.vars.menuDefined = place.vars.dataPub.sunday.sundayMenu;
                    break;

                case moment().weekday() === 1:
                    place.vars.menuDefined = place.vars.dataPub.monday.mondayMenu;
                    break;

                case moment().weekday() === 2:
                    place.vars.menuDefined = place.vars.dataPub.tuesday.tuesdayMenu;
                    break;

                case moment().weekday() === 3:
                    place.vars.menuDefined = place.vars.dataPub.wednesday.wednesdayMenu;
                    break;

                case moment().weekday() === 4:
                    place.vars.menuDefined = place.vars.dataPub.thursday.thursdayMenu;
                    break;

                case moment().weekday() === 5:
                    place.vars.menuDefined = place.vars.dataPub.friday.fridayMenu;
                    break;

                default:
                    place.vars.menuDefined = place.vars.dataPub.saturday.saturdayMenu;
            }
        },

        getMenu : {
            getMenu : function () {
                placeService.getMenu.save(place.vars, place.functions.getMenu.success);
            },

            success : function (data) {
                place.vars.menu = data.data;

                if(place.vars.menu){
                    //region List products by category
                    place.vars.listCategory.forEach(function (valueCat, keyCat) {

                        place.vars.listByCategory.push({
                            categoryName : valueCat.categoryName,
                            products: []
                        });

                        place.vars.menu.productsID.forEach(function (valueProd, keyProd) {
                            if(valueCat._id === valueProd.categoryID){
                                if(!valueProd.promotionValue || valueProd.promotionValue === 0 || valueProd.promotionValue === 'null'){
                                    place.vars.listByCategory[keyCat].products.push({
                                        productID: valueProd._id,
                                        productName: valueProd.productName,
                                        value : valueProd.value,
                                        promotionValue : valueProd.promotionValue,
                                        imgPath : valueProd.imgPath,
                                        description:  valueProd.description,
                                    })
                                }
                            }
                        });
                    });
                    place.vars.listByCategoryFilter = place.vars.listByCategory;
                    //endregion

                    //region List products by promotion
                    place.vars.menu.productsID.forEach(function (value) {
                       if(value.promotionValue && value.promotionValue > 0){
                           place.vars.listPromotion.push({
                               productID: value._id,
                               productName: value.productName,
                               value : value.value,
                               promotionValue : value.promotionValue,
                               imgPath : value.imgPath,
                               description:  value.description,
                           })
                       }
                    });
                    //endregion
                }
            }
        },

        getCategory : {
            getCategory : function () {
                placeService.getCategory.save({id : place.vars.dataPub._id}, place.functions.getCategory.successGetCategory);
            },

            successGetCategory : function (data) {
                place.vars.listCategory = data.data;
            }
        },

        checkFavorite : {
            checkFavorite : function () {
                if(getProfile.status){
                    mainListService.getListPubsFavorites.save({
                        userID : getProfile.id
                    }, place.functions.checkFavorite.successCheckFavorite);
                }
            },

            successCheckFavorite : function (data) {
                if(data.data){
                    place.vars.favorite = $.grep(data.data, function(value){
                        return value._id === place.vars.dataPub._id;
                    });

                    if(place.vars.favorite.length > 0){
                        place.vars.favorite = true;
                    }else{
                        place.vars.favorite = false;
                    }
                }
            }
        },

        markFavorite : {
            markFavorite : function () {
                placeService.markFavorite.save({
                    userID : getProfile.id,
                    place : place.vars.dataPub
                }, place.functions.markFavorite.successMarkFavorite);
            },

            successMarkFavorite : function () {
                place.vars.favorite = !place.vars.favorite;
            }
        },

        notFavorite : {
            notFavorite : function () {
                placeService.notFavorite.save({
                    userID : getProfile.id,
                    place : place.vars.dataPub
                }, place.functions.notFavorite.successNotFavorite);
            },

            successNotFavorite : function () {
                place.vars.favorite = !place.vars.favorite;
            }
        },

        takeQRCode : function () {
            $state.go('QRCodeReader', {
                place : {
                    pubData : place.vars.dataPub,
                    userLocal : {
                        lat : place.vars.userLat,
                        long : place.vars.userLong
                    }
                }
            });
        },
    };

    place.functions.core();
}
})();
(function(){
"use strict";
angular.module('place')
    .service('placeService', placeService);

function placeService($resource, defineHost) {
    return {
        getMenu : $resource(defineHost.host + '/app/getMenu'),
        getCategory : $resource(defineHost.host + '/app/getCategory'),
        notFavorite : $resource(defineHost.host + '/app/notFavorite'),
        markFavorite : $resource(defineHost.host + '/app/markFavorite')
    }
}
})();
(function(){
"use strict";
angular.module('placeRequest', [])
    .controller('placeRequestController', placeRequestController);

function placeRequestController($stateParams, $state, placeService, placeRequestService, toastAction, dialogAdvanced, saveLastAction) {
    var placeRequest = this;
    placeRequest.vars = {};

    placeRequest.functions = {
        core : function () {
            placeRequest.functions.defineVars().then(function () {
                placeRequest.functions.getCategory().then(function () {
                    placeRequest.functions.defineMenu();
                    placeRequest.functions.getMenu.getMenu();
                    placeRequest.functions.socketConfig();
                });
            }, function () {
                $state.go('user.mainList')
            });
        },

        defineVars : function () {
            return new Promise(function (success, fail) {
                if(!angular.equals($stateParams.requestID, {})){
                    placeRequest.vars.dataPub = $stateParams.place.pubData;
                    placeRequest.vars.tableID = $stateParams.tableID;
                    placeRequest.vars.requestID = $stateParams.requestID;
                    placeRequest.vars.listByCategory = [];
                    placeRequest.vars.listPromotion = [];
                    placeRequest.vars.listProductsInRequest = [];
                    success();
                }else{
                    fail();
                }
            });
        },

        defineMenu : function () {
            switch (true) {
                case moment().weekday() === 0:
                    placeRequest.vars.menuDefined = placeRequest.vars.dataPub.sunday.sundayMenu;
                    break;

                case moment().weekday() === 1:
                    placeRequest.vars.menuDefined = placeRequest.vars.dataPub.monday.mondayMenu;
                    break;

                case moment().weekday() === 2:
                    placeRequest.vars.menuDefined = placeRequest.vars.dataPub.tuesday.tuesdayMenu;
                    break;

                case moment().weekday() === 3:
                    placeRequest.vars.menuDefined = placeRequest.vars.dataPub.wednesday.wednesdayMenu;
                    break;

                case moment().weekday() === 4:
                    placeRequest.vars.menuDefined = placeRequest.vars.dataPub.thursday.thursdayMenu;
                    break;

                case moment().weekday() === 5:
                    placeRequest.vars.menuDefined = placeRequest.vars.dataPub.friday.fridayMenu;
                    break;

                default:
                    placeRequest.vars.menuDefined = placeRequest.vars.dataPub.saturday.saturdayMenu;
            }
        },

        getCategory : function () {
            return new Promise(function (success) {
                placeService.getCategory.save({id : placeRequest.vars.dataPub._id}, function(data){
                    placeRequest.vars.listCategory = data.data;
                    success();
                });
            });
        },

        getMenu : {
            getMenu : function () {
                placeService.getMenu.save(placeRequest.vars, placeRequest.functions.getMenu.success);
            },

            success : function (data) {
                placeRequest.vars.menu = data.data;

                if(placeRequest.vars.menu){
                    //region List products by category
                    placeRequest.vars.listCategory.forEach(function (valueCat, keyCat) {

                        placeRequest.vars.listByCategory.push({
                            categoryName : valueCat.categoryName,
                            products: []
                        });

                        placeRequest.vars.menu.productsID.forEach(function (valueProd, keyProd) {
                            if(valueCat._id === valueProd.categoryID){
                                if(!valueProd.promotionValue || valueProd.promotionValue === 0 || valueProd.promotionValue === 'null'){
                                    placeRequest.vars.listByCategory[keyCat].products.push({
                                        productID: valueProd._id,
                                        productName: valueProd.productName,
                                        value : valueProd.value,
                                        promotionValue : valueProd.promotionValue,
                                        imgPath : valueProd.imgPath,
                                        amountInRequest : 0,
                                        description: valueProd.description
                                    });
                                }
                            }
                        });
                    });
                    placeRequest.vars.listByCategoryFilter = placeRequest.vars.listByCategory;
                    //endregion

                    //region List products by promotion
                    placeRequest.vars.menu.productsID.forEach(function (value) {
                        if(value.promotionValue && value.promotionValue > 0){
                            placeRequest.vars.listPromotion.push({
                                productID: value._id,
                                productName: value.productName,
                                value : value.value,
                                promotionValue : value.promotionValue,
                                imgPath : value.imgPath,
                                amountInRequest : 0,
                                description: value.description
                                
                            });
                        }
                    });
                    //endregion
                }
            }
        },

        controlRequest : {
            addInGeneral : function (data) {
                data.amountInRequest += 1;
                placeRequest.vars.listProductsInRequest.push({
                    productID : data.productID
                });
            },

            removeToGeneral : function (data) {
                if(data.amountInRequest === 0){
                    data.amountInRequest = 0;

                    if(placeRequest.vars.listProductsInRequest.map(function(e) { return e.productID; }).indexOf(data.productID) > -1){
                        placeRequest.vars.listProductsInRequest.splice(placeRequest.vars.listProductsInRequest.map(function(e) { return e.productID; }).indexOf(data.productID), 1);
                    }
                }else{
                    data.amountInRequest -= 1;
                    if(placeRequest.vars.listProductsInRequest.map(function(e) { return e.productID; }).indexOf(data.productID) > -1){
                        placeRequest.vars.listProductsInRequest.splice(placeRequest.vars.listProductsInRequest.map(function(e) { return e.productID; }).indexOf(data.productID), 1);
                    }
                }
            },

            sendRequest : {
                sendRequest : function () {
                    if(placeRequest.vars.listProductsInRequest.length === 0){
                        toastAction.show({
                            top : false,
                            bottom : true,
                            left : false,
                            right : true,
                            text : 'Você não adicionou nenhum produto ao pedido ainda.',
                            scope : placeRequest
                        });
                    }else {
                        placeRequest.vars.sendDisabled = true;
                        placeRequestService.addProductsInRequest.save({
                            products : placeRequest.vars.listProductsInRequest,
                            requestID : placeRequest.vars.requestID
                        }, placeRequest.functions.controlRequest.sendRequest.successSendRequest);
                    }
                },

                successSendRequest : function (data) {
                    if(data.status){
                        toastAction.show({
                            top : true,
                            bottom : false,
                            left : false,
                            right : true,
                            text : 'Produto enviado com sucesso.',
                            scope : placeRequest
                        });
                        placeRequest.vars.sendDisabled = false;

                        placeRequest.vars.listProductsInRequest = [];
                        placeRequest.vars.listPromotion.forEach(function (value) {
                            value.amountInRequest = 0;
                        });
                        placeRequest.vars.listByCategory.forEach(function (value) {
                            value.products.forEach(function (value) {
                                value.amountInRequest = 0;
                            })
                        });
                    }else{
                        toastAction.show({
                            top : true,
                            bottom : false,
                            left : false,
                            right : true,
                            text : 'Alguma coisa deu errado, tente novamente.',
                            scope : placeRequest
                        });
                        placeRequest.vars.sendDisabled = false;
                    }
                }
            }
        },

        requireClose : {
            requireClose : function () {
                placeRequestService.requireClose.save({
                    requestID : placeRequest.vars.requestID
                }, placeRequest.functions.requireClose.successRequireClose);
            },

            successRequireClose : function (data) {
                toastAction.show({
                    top : false,
                    bottom : true,
                    left : false,
                    right : true,
                    text : 'Seu pedido esta sendo encerrado, aguarde um instante.',
                    scope : placeRequest
                });
            }
        },
        
        getListProductsRequest : {
            getListProductsRequest : function () {
                placeRequestService.getListProductsRequest.save({
                    requestID : placeRequest.vars.requestID
                }, placeRequest.functions.getListProductsRequest.successGetListProductsRequest);
            },

            successGetListProductsRequest : function (data) {
                if(data.status){
                    placeRequest.vars.dataResume = data.data;
                    placeRequest.vars.listProducts = [];
                    placeRequest.vars.dataResume.products.forEach(function (value) {
                        if(placeRequest.vars.listProducts.map(function(e) {
                                return e._id;
                            }).indexOf(value.productID._id) < 0) {
                            if(value.productID.promotionValue !== 'null'){
                                value.productID.realValue = value.productID.promotionValue
                            }else{
                                value.productID.realValue = value.productID.value
                            }

                            placeRequest.vars.listProducts.push({
                                _id : value.productID._id,
                                productName : value.productID.productName,
                                value : value.productID.realValue,
                                amount : 1
                            });
                        }else{
                            placeRequest.vars.listProducts[placeRequest.vars.listProducts.map(function(e) { return e._id; }).indexOf(value.productID._id)].amount ++;
                        }
                    });

                    if(placeRequest.vars.listProducts.length > 0){
                        placeRequest.vars.total = 0;
                        placeRequest.vars.listProducts.forEach(function (value) {
                            placeRequest.vars.total = placeRequest.vars.total + (value.value * value.amount);
                        })
                    }
                }
            }
        },

        socketConfig : function () {
            socket.on(placeRequest.vars.requestID, function (data) {
                switch (true){
                    case data.type === 'requestVerified':
                        if(data.closeRequest){
                            dialogAdvanced.cancel();
                            toastAction.show({
                                top : false,
                                bottom : true,
                                left : false,
                                right : true,
                                text : 'Obrigado por usar o serveJa :)',
                                scope : placeRequest
                            });
                            saveLastAction.clear();
                        }
                        break;
                }
            });
        },
    };

    placeRequest.functions.core();
}
})();
(function(){
"use strict";
angular.module('placeRequest')
    .service('placeRequestService', placeRequestService);

function placeRequestService($resource, defineHost) {
    return {
        addProductsInRequest : $resource(defineHost.host + '/app/addProductsInRequest'),
        requireClose : $resource(defineHost.host + '/app/requireClose'),
        getListProductsRequest : $resource(defineHost.host + '/app/getListProductsRequest')
    }
}
})();