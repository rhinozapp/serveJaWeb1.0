(function(){
"use strict";
angular.module('modules', [
    'home',
    'recoveryPassword',
    'products',
    'profile',
    'menu',
    'tables',
    'requests',
    'oldRequests'
]);
})();
(function(){
"use strict";
angular.module('home', [])
    .controller('homeController', home);

function home(dialogAdvanced) {
    var home = this;

    home.functions = {
        core: function() {},

        doLogin: function() {
            dialogAdvanced.show({
                controller: loginController,
                controllerAs: 'login',
                templateUrl: 'templates/modules/home/loginDialog.html',
                clickOutsideToClose: false
                    /*functionThen : function () {}*/
            });
        },

        signUp: function() {
            dialogAdvanced.show({
                controller: signUPController,
                controllerAs: 'signUP',
                templateUrl: 'templates/modules/home/signUPDialog.html',
                clickOutsideToClose: false
                    /*functionThen : function () {}*/
            });
        }
    };

    home.functions.core();
}

function loginController($scope, dialogAdvanced, loginService, recoveryPasswordService, dialogAlert, $window) {
    var login = this;
    login.vars = {};

    login.functions = {
        core: function() {},

        loginAction: function() {
            loginService.doLogin.save(login.vars, function(data) {
                console.log(data.status === true);
                switch (true) {
                    case data.status === true:
                        login.vars.alert = false;

                        $window.localStorage.token = data.token;
                        $window.location.reload();
                        break;

                    case data.status === false:
                        $scope.loginForm.username.$setValidity('userPassFound', false);
                        $scope.loginForm.password.$setValidity('userPassFound', false);
                        break;

                    default:
                        $scope.loginForm.username.$setValidity('userPassFound', false);
                        $scope.loginForm.password.$setValidity('userPassFound', false);
                }
            });
        },

        recoveryPasswordSend: function() {
            recoveryPasswordService.recoveryPasswordSend.save(login.vars, function(data) {
                switch (true) {
                    case data.status === true:
                        login.vars.alert = true;
                        login.vars.message = 'Enviamos um link para recuperação de senha, veja seu e-mail e clique no link para alterá-la.';
                        break;

                    case data.status === false:
                        $scope.loginForm.forgotPass.$setValidity('userFound', false);
                        break;

                    default:
                        $scope.loginForm.forgotPass.$setValidity('userFound', false);
                }
            });
        },

        signUP: function() {
            dialogAdvanced.show({
                controller: signUPController,
                controllerAs: 'signUP',
                templateUrl: 'templates/modules/home/signUPDialog.html',
                clickOutsideToClose: false
                    /*functionThen : function () {}*/
            });
        },

        cancel: function() {
            dialogAdvanced.cancel();
        }
    };
}

function signUPController(dialogAdvanced, loginService, zipCodeSearch, $scope, dialogAlert, $window) {
    var signUP = this;
    signUP.vars = {};

    signUP.functions = {
        core: function() {
            signUP.functions.defineVars();
            signUP.functions.watchMatch();
        },

        defineVars: function() {
            signUP.vars.listUF = [
                'SP',
                'AC',
                'AL',
                'AM',
                'AP',
                'BA',
                'CE',
                'DF',
                'ES',
                'GO',
                'MA',
                'MG',
                'MS',
                'MT',
                'PA',
                'PB',
                'PE',
                'PI',
                'PR',
                'RJ',
                'RN',
                'RO',
                'RR',
                'RS',
                'SC',
                'SE',
                'TO'
            ];
        },

        watchMatch: function() {
            $scope.$watchGroup(['signUP.vars.password', 'signUP.vars.repPassword'], function(value) {
                if (value[0] !== value[1]) {
                    $scope.adminSignUp.password.$setValidity('notMatch', false);
                    $scope.adminSignUp.repPassword.$setValidity('notMatch', false);
                } else {
                    $scope.adminSignUp.password.$setValidity('notMatch', true);
                    $scope.adminSignUp.repPassword.$setValidity('notMatch', true);
                }
            });
        },

        checkCNPJ: function() {
            if (signUP.vars.cnpj === '00000000000000') {
                $scope.adminSignUp.cnpj.$setValidity('void', false);
            }else{
                $scope.adminSignUp.cnpj.$setValidity('void', true);
            }
        },

        zipCodeChange: function() {
            signUP.vars.zipCode = signUP.vars.zipCode.replace('-', '');
            if (signUP.vars.zipCode.length >= 8) {
                zipCodeSearch.getData(signUP.vars).then(function(data) {
                    signUP.vars.address = data.address.logradouro;
                    /*signUP.vars.complement = data.address.complemento;*/
                    signUP.vars.neighborhood = data.address.bairro;
                    signUP.vars.city = data.address.localidade;
                    signUP.vars.uf = data.address.uf;
                    signUP.vars.lat = data.latlong.lat;
                    signUP.vars.long = data.latlong.lng;
                    signUP.vars.status = data.latlong.status;
                });
            }
        },

        usernameChange: function() {
            loginService.usernameValidation.save(signUP.vars, function(data) {
                switch (true) {
                    case data.status === true:
                        $scope.adminSignUp.email.$setValidity('userExist', true);
                        break;

                    case data.status === false:
                        $scope.adminSignUp.$valid = false;
                        $scope.adminSignUp.email.$setValidity('userExist', false);
                        signUP.vars.message = data.message;
                        break;

                    default:
                        signUP.vars.message = data.message;
                }
            })
        },

        signUPAction: function() {
            loginService.signUP.save(signUP.vars, function(data) {
                switch (true) {
                    case data.status === true:
                        signUP.vars.message = 'Você foi cadastrado com sucesso!';
                        $window.localStorage.token = data.token;
                        $window.location.reload();
                        break;

                    case data.status === false:
                        signUP.vars.message = data.message;
                        break;

                    default:
                        signUP.vars.message = 'Alguma coisa deu errado, tente novamente :(!';
                }

                dialogAlert.show({
                    title: 'Atenção',
                    content: signUP.vars.message,
                    ok: 'Ok'
                });
            });
        },

        cancel: function() {
            dialogAdvanced.cancel();
        },

        doLogin: function() {
            dialogAdvanced.show({
                controller: loginController,
                controllerAs: 'login',
                templateUrl: 'templates/modules/home/loginDialog.html',
                clickOutsideToClose: false
                /*functionThen : function () {}*/
            });
        },
    };

    signUP.functions.core();
}
})();
(function(){
"use strict";
/**
 * Created by guiga on 25/05/2017.
 */

angular.module('home')
    .service('loginService', loginService)
    .factory('authInterceptor', authInterceptor)
    .config(function($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    });

function loginService($window, $resource, defineHost) {
    return {
        signUP: $resource(defineHost.host + '/web/signUp'),
        usernameValidation: $resource(defineHost.host + '/web/usernameValidation'),
        doLogin: $resource(defineHost.host + '/web/doLogin'),
        doLogout: function() {
            $window.localStorage.clear();
            $window.location.reload();
        }
    }
}

function authInterceptor($q, $window) {
    return {
        request: function(config) {
            config.headers = config.headers || {};

            if ($window.localStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
            }
            return config;
        },
        response: function(response) {
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
angular.module('menu', [])
    .controller('menuController', menu);

function menu($scope, $filter, menuService, profileGet, dialogAdvanced, dialogAlert, dialogConfirm) {
    var menu = this;
    menu.vars = {};

    menu.functions = {
        core : function () {
            menu.functions.get.getMenu();
            menu.functions.search();
            menu.functions.defineVars();
        },

        defineVars : function () {
            menu.vars.filter = false;
            menu.vars.query = {
                order: '-menuName',
                limit: 25,
                page: 1
            };
        },

        closeFilter : function () {
            menu.vars.filter = false;
            menu.vars.search = "";
        },

        search : function () {
            $scope.$watch('menu.vars.search', function (newvalue, oldvalue) {
                if(newvalue < oldvalue){
                    menu.vars.listMenuFilter = menu.vars.listMenu
                }else{
                    menu.vars.listMenuFilter = $filter('filter')(menu.vars.listMenu, {
                        menuName : newvalue
                    });
                }
            });
        },

        get : {
            getMenu : function () {
                menuService.getMenu.save({id : profileGet.id}, menu.functions.get.successGetMenu);
            },

            successGetMenu : function (data) {
                menu.vars.listMenu = data.data;
                menu.vars.listMenuFilter = menu.vars.listMenu;
            }
        },

        saveMenu : function(data) {
            dialogAdvanced.show({
                controller : saveMenuController,
                controllerAs : 'saveMenu',
                templateUrl : 'templates/modules/menu/saveMenu.html',
                clickOutsideToClose : false,
                dataToDialog : data,
                functionThen : function (edit) {
                    menu.functions.get.getMenu();

                    if(edit){
                        dialogAlert.show({
                            title : 'Sucesso!',
                            content : 'Seu cardápio foi atualizado com sucesso!',
                            ok : 'OK!'
                        });
                    }else{
                        dialogAlert.show({
                            title : 'Sucesso!',
                            content : 'Seu cardápio foi criado com sucesso!',
                            ok : 'OK!'
                        });
                    }
                }
            });
        },

        deleteMenu : function (data) {
            dialogConfirm.show({
                title : 'Atenção!',
                textContent : 'Deseja realmente deletar este cardápio?',
                ok : 'Sim',
                cancel : 'Cancelar',
                confirmFunction : function () {
                    menuService.deleteMenu.save({menuID : data}, function () {
                        dialogAlert.show({
                            title : 'Cardápio deletado!',
                            content : 'Seu cardápio foi deletado com sucesso.',
                            ok : 'OK'
                        });
                        menu.functions.get.getMenu();
                    });
                }
            });
        }
    };

    menu.functions.core();
}

function saveMenuController(dialogAdvanced, menuService, productsService, profileGet, data) {
    var saveMenu = this;
    saveMenu.vars = {};

    saveMenu.functions = {
        core : function () {
            saveMenu.functions.defineVars();
            saveMenu.functions.getCategory.getCategory();
            saveMenu.functions.getProduct.getProduct();
        },

        defineVars : function () {
            saveMenu.vars.listOrder = [];
            if(data){
                saveMenu.vars.menuName = data.menuName;
                saveMenu.vars.menuID = data._id;
                saveMenu.vars.dataList = data.productsID;
                saveMenu.vars.edit = true;
            }
        },

        hide : function () {
            dialogAdvanced.hide();
        },

        cancel : function () {
            dialogAdvanced.cancel();
        },

        getCategory : {
            getCategory : function () {
                productsService.getCategory.save({id : profileGet.id}, saveMenu.functions.getCategory.successGetCategory);
            },

            successGetCategory : function (data) {
                saveMenu.vars.listCategory = data.data;
            }
        },

        getProduct : {
            getProduct : function () {
                productsService.getProducts.save({id : profileGet.id}, saveMenu.functions.getProduct.successGetProducts);
            },

            successGetProducts : function (result) {
                saveMenu.vars.listProducts = result.data;

                if(saveMenu.vars.listCategory){
                    saveMenu.vars.listCategory.forEach(function (valueCat, keyCat) {

                        saveMenu.vars.listOrder.push({
                            categoryName : valueCat.categoryName,
                            products: []
                        });

                        saveMenu.vars.listProducts.forEach(function (valueProd) {
                            if(valueCat._id === valueProd.categoryID){
                                if(data){
                                    if(saveMenu.vars.dataList.indexOf(valueProd._id) >= 0){
                                        saveMenu.vars.listOrder[keyCat].products.push({
                                            productID : valueProd._id,
                                            productName : valueProd.productName,
                                            statusInMenu : true
                                        });
                                    }else{
                                        saveMenu.vars.listOrder[keyCat].products.push({
                                            productID : valueProd._id,
                                            productName : valueProd.productName
                                        });
                                    }
                                }else{
                                    saveMenu.vars.listOrder[keyCat].products.push({
                                        productID : valueProd._id,
                                        productName : valueProd.productName
                                    });
                                }
                            }
                        });
                    });
                }
            }
        },

        save : {
            doSave : function () {
                menuService.updateMenu.save({id : profileGet.id, data : saveMenu.vars.listOrder, name : saveMenu.vars.menuName, menuID : saveMenu.vars.menuID}, saveMenu.functions.save.successSaveProducts);
            },

            successSaveProducts : function (data) {
                saveMenu.functions.hide(saveMenu.vars.edit);
            }
        }
    };

    saveMenu.functions.core();
}
})();
(function(){
"use strict";
angular.module('menu')
    .service('menuService', menuService);

function menuService($resource, defineHost) {
    return {
        updateMenu : $resource(defineHost.host + '/web/updateMenu'),
        getMenu : $resource(defineHost.host + '/web/getMenu'),
        deleteMenu : $resource(defineHost.host + '/web/deleteMenu')
    }
}
})();
(function(){
"use strict";
angular.module('oldRequests', [])
    .controller('oldRequestsController', oldRequests);

function oldRequests($scope, $filter, oldRequestsService, profileGet, dialogAdvanced) {
    var oldRequests = this;
    oldRequests.vars = {};

    oldRequests.functions = {
        core: function () {
            oldRequests.functions.defineVars();
            oldRequests.functions.getOldRequests.getOldRequests();
        },

        defineVars : function () {
            oldRequests.vars.query = {
                order: '-dateCreate',
                limit: 100,
                page: 1
            };

            oldRequests.vars.requestsList = [];
            oldRequests.vars.listProductsInRequest = [];
        },

        getOldRequests : {
            getOldRequests : function () {
                oldRequestsService.getOldRequests.save(profileGet, oldRequests.functions.getOldRequests.successGetOldRequests)
            },

            successGetOldRequests : function (data) {
                oldRequests.vars.requestsList = data.requests;
                oldRequests.functions.getOldRequests.treatmentBase();
            },

            treatmentBase : function () {
                oldRequests.vars.requestsList.forEach(function (valueListProducts) {
                    if(valueListProducts.products.length > 0){
                        valueListProducts.products.forEach(function (valueProduct) {
                            if(!valueProduct.status){
                                oldRequests.vars.listProductsInRequest.push({
                                    idRequest : valueProduct._id,
                                    productName : valueProduct.productID.productName,
                                    value : valueProduct.productID.value,
                                    promotionValue : valueProduct.productID.promotionValue,
                                    tableName : valueListProducts.tableID.tableName,
                                    dateInsert : valueProduct.dateInsert
                                })
                            }
                        })
                    }
                })
            }
        },

        moreDetailsOldRequest : function (data) {
            dialogAdvanced.show({
                controller : moreDetailsOldRequestController,
                controllerAs : 'moreDetailsOldRequest',
                clickOutsideToClose : false,
                templateUrl : 'templates/modules/oldRequests/moreDetailsOldRequest.html',
                dataToDialog : data,
                functionThen : function () {
                    oldRequests.functions.core();
                }
            });
        }
    };

    oldRequests.functions.core();
}

function moreDetailsOldRequestController(data, dialogAdvanced) {
    var moreDetailsOldRequest = this;
    moreDetailsOldRequest.vars = {};

    moreDetailsOldRequest.functions = {
        core: function () {
            moreDetailsOldRequest.functions.defineVars();
        },

        defineVars: function () {
            moreDetailsOldRequest.vars.dataResume = data;
            moreDetailsOldRequest.vars.listProducts = [];
            moreDetailsOldRequest.vars.dataResume.products.forEach(function (value) {
                if (moreDetailsOldRequest.vars.listProducts.map(function (e) {
                        return e._id;
                    }).indexOf(value.productID._id) < 0) {
                    if (value.productID.promotionValue !== 'null') {
                        value.productID.realValue = value.productID.promotionValue
                    } else {
                        value.productID.realValue = value.productID.value
                    }

                    moreDetailsOldRequest.vars.listProducts.push({
                        _id: value.productID._id,
                        productName: value.productID.productName,
                        value: value.productID.realValue,
                        amount: 1
                    });
                } else {
                    moreDetailsOldRequest.vars.listProducts[moreDetailsOldRequest.vars.listProducts.map(function (e) {
                        return e._id;
                    }).indexOf(value.productID._id)].amount++;
                }
            });

            if (moreDetailsOldRequest.vars.listProducts.length > 0) {
                moreDetailsOldRequest.vars.total = 0;
                moreDetailsOldRequest.vars.listProducts.forEach(function (value) {
                    moreDetailsOldRequest.vars.total = moreDetailsOldRequest.vars.total + (value.value * value.amount);
                })
            }
        },

        hide: function () {
            dialogAdvanced.hide();
        },

        cancel: function () {
            dialogAdvanced.cancel();
        },
    };

    moreDetailsOldRequest.functions.core();
}
})();
(function(){
"use strict";
angular.module('oldRequests')
    .service('oldRequestsService', oldRequestsService);

function oldRequestsService($resource, defineHost) {
    return {
        getOldRequests: $resource(defineHost.host + '/web/getOldRequests')
    }
}
})();
(function(){
"use strict";
angular.module('products', [])
    .controller('productsController', products);

function products($scope, $filter, productsService, profileGet, dialogAdvanced, dialogAlert, dialogConfirm) {
    var products = this;
    products.vars = {};

    products.functions = {
        core : function () {
            products.functions.getCategory.getCategory();
            products.functions.get.getProduct();
            products.functions.search();
            products.functions.defineVars();
        },

        defineVars : function () {
            products.vars.filter = false;
            products.vars.query = {
                order: '-productName',
                limit: 25,
                page: 1
            };
        },

        closeFilter : function () {
            products.vars.filter = false;
            products.vars.search = "";
        },

        search : function () {
            $scope.$watch('products.vars.search', function (newvalue, oldvalue) {
                if(newvalue < oldvalue){
                    products.vars.listProductsFilter = products.vars.listProducts
                }else{
                    products.vars.listProductsFilter = $filter('filter')(products.vars.listProducts, {
                        productName : newvalue
                    });
                }
            });
        },

        get : {
            getProduct : function () {
                productsService.getProducts.save({id : profileGet.id}, products.functions.get.successGetProducts);
            },

            successGetProducts : function (data) {
                products.vars.listProducts = data.data;
                products.vars.listProductsFilter = products.vars.listProducts;

                if(products.vars.listCategory){
                    products.vars.listProductsFilter.forEach(function (valueProd) {
                        products.vars.listCategory.forEach(function (valueCat) {
                            if(valueProd.categoryID === valueCat._id){
                                valueProd.nameCategory = valueCat.categoryName
                            }
                        });
                    });
                }
            }
        },

        getCategory : {
            getCategory : function () {
                productsService.getCategory.save({id : profileGet.id}, products.functions.getCategory.successGetCategory);
            },

            successGetCategory : function (data) {
                products.vars.listCategory = data.data;
            }
        },

        saveProducts : function(data) {
            dialogAdvanced.show({
                controller : saveProductsController,
                controllerAs : 'saveProducts',
                templateUrl : 'templates/modules/products/saveProducts.html',
                clickOutsideToClose : false,
                dataToDialog : data,
                functionThen : function (showSuccess) {
                    if(showSuccess){
                        dialogAlert.show({
                            title : 'Sucesso!',
                            content : 'Seu produto foi criado com sucesso!',
                            ok : 'OK!'
                        });
                    }
                    products.functions.get.getProduct();
                }
            });
        },

        createCategory : function() {
            dialogAdvanced.show({
                controller : saveCategoryController,
                controllerAs : 'saveCategory',
                templateUrl : 'templates/modules/products/saveCategory.html',
                clickOutsideToClose : false
            });
        },

        deleteProduct : function (data) {
            dialogConfirm.show({
                title : 'Atenção!',
                textContent : 'Deseja realmente deletar este produto?',
                ok : 'Sim',
                cancel : 'Cancelar',
                confirmFunction : function () {
                    productsService.deleteProducts.save({id : data}, function () {
                        dialogAlert.show({
                            title : 'Produto deletado!',
                            content : 'Seu produto foi deletado com sucesso.',
                            ok : 'OK'
                        });
                        products.functions.get.getProduct();
                    });
                }
            });
        }
    };

    products.functions.core();
}

function saveProductsController(dialogAdvanced, toastAction, productsService, profileGet, data, Upload) {
    var saveProducts = this;
    saveProducts.vars = {};

    saveProducts.functions = {
        core : function () {
            saveProducts.functions.defineVars();
            saveProducts.functions.getCategory.getCategory();
        },

        defineVars : function () {
            if(data){
                saveProducts.vars = data;
                saveProducts.vars.value = Number(saveProducts.vars.value);
                saveProducts.vars.promotionValue = Number(saveProducts.vars.promotionValue);
                saveProducts.vars.amount = Number(saveProducts.vars.amount);
            }
        },

        hide : function (showSuccess) {
            saveProducts.vars = {};
            dialogAdvanced.hide(showSuccess);
        },

        cancel : function () {
            saveProducts.vars = {};
            dialogAdvanced.cancel();
        },

        getCategory : {
            getCategory : function () {
                productsService.getCategory.save({id : profileGet.id}, saveProducts.functions.getCategory.successGetCategory);
            },

            successGetCategory : function (data) {
                saveProducts.vars.listCategory = data.data;
            }
        },

        save : {
            doSave : function () {
                Upload.upload({
                    url: '/web/saveProducts',
                    method: 'POST',
                    data: {
                        file: saveProducts.vars.files,
                        vars : saveProducts.vars,
                        id : profileGet.id
                    }
                }).then(saveProducts.functions.save.successSaveProducts);
            },

            successSaveProducts : function (data) {
                saveProducts.functions.hide(true);
            }
        },

        saveAndNew : {
            doSave : function () {
                Upload.upload({
                    url: '/web/saveProducts',
                    method: 'POST',
                    data: {
                        file: saveProducts.vars.files,
                        vars : saveProducts.vars,
                        id : profileGet.id
                    }
                }).then(saveProducts.functions.saveAndNew.successSaveProducts);
            },

            successSaveProducts : function (data) {
                toastAction.show({
                    top : false,
                    bottom : true,
                    left : false,
                    right : true,
                    text : 'Produto salvo!',
                    scope : saveProducts
                });
                saveProducts.vars = {};
                saveProducts.functions.getCategory.getCategory();
            }
        }
    };

    saveProducts.functions.core();
}

function saveCategoryController(dialogAdvanced, productsService, profileGet) {
    var saveCategory = this;
    saveCategory.vars = {};

    saveCategory.functions = {
        core : function () {
            saveCategory.functions.get.getCategory();
            saveCategory.functions.defineVars();
        },

        defineVars : function () {
            saveCategory.vars.filter = false;
            saveCategory.vars.query = {
                order: '-categoryName',
                limit: 10,
                page: 1
            };
        },

        hide : function () {
            saveCategory.vars = {};
            dialogAdvanced.hide();
        },

        cancel : function () {
            saveCategory.vars = {};
            dialogAdvanced.cancel();
        },

        get : {
            getCategory : function () {
                productsService.getCategory.save({id : profileGet.id}, saveCategory.functions.get.successGetCategory);
            },

            successGetCategory : function (data) {
                saveCategory.vars.listCategory = data.data;
            }
        },

        save : {
            doSave : function () {
                productsService.saveCategory.save({id : profileGet.id, data : saveCategory.vars}, saveCategory.functions.save.successSave);
            },

            successSave : function (data) {
                saveCategory.vars = {};
                saveCategory.functions.core();
            }
        },

        edit : {
            selectEdit : function (data) {
                saveCategory.vars.categoryID = data._id;
                saveCategory.vars.categoryName = data.categoryName;
                saveCategory.vars.editMode = true;
            },

            backToCreate : function () {
                saveCategory.vars = {};
                saveCategory.functions.core();
            }
        },

        delete : {
            deleteCategory : function (data) {
                saveCategory.vars.categoryID = data._id;
                productsService.deleteCategory.save(saveCategory.vars, saveCategory.functions.delete.successDeleteCategory);
            },

            successDeleteCategory : function () {
                saveCategory.vars = {};
                saveCategory.functions.core();
            }
        }
    };

    saveCategory.functions.core();
}
})();
(function(){
"use strict";
angular.module('products')
    .service('productsService', productsService);

function productsService($resource, defineHost) {
    return {
        saveProducts : $resource(defineHost.host + '/web/saveProducts'),
        getProducts : $resource(defineHost.host + '/web/getProducts'),
        deleteProducts : $resource(defineHost.host + '/web/deleteProducts'),
        saveCategory : $resource(defineHost.host + '/web/saveCategory'),
        getCategory : $resource(defineHost.host + '/web/getCategory'),
        deleteCategory : $resource(defineHost.host + '/web/deleteCategory')
    }
}
})();
(function(){
"use strict";
angular.module('profile', [])
    .controller('profileController', profile);

function profile(profileGet, profileService, zipCodeSearch, Upload, dialogAlert, menuService) {
    var profile = this;
    profile.vars = {};

    profile.functions = {
        core: function() {
            profile.functions.getProfile.get();
            profile.functions.getMenu.getMenu();
        },

        defineVars: function() {
            profile.vars.hours = [
                '00:00',
                '00:30',
                '01:00',
                '01:30',
                '02:00',
                '02:30',
                '03:00',
                '03:30',
                '04:00',
                '04:30',
                '05:00',
                '05:30',
                '06:00',
                '06:30',
                '07:00',
                '07:30',
                '08:00',
                '08:30',
                '09:00',
                '09:30',
                '10:00',
                '10:30',
                '11:00',
                '11:30',
                '12:00',
                '12:30',
                '13:00',
                '13:30',
                '14:00',
                '14:30',
                '15:00',
                '15:30',
                '16:00',
                '16:30',
                '17:00',
                '17:30',
                '18:00',
                '18:30',
                '19:00',
                '19:30',
                '20:00',
                '20:30',
                '21:00',
                '21:30',
                '22:00',
                '22:30',
                '23:00',
                '23:30'
            ];
            profile.vars.listUF = [
                'SP',
                'AC',
                'AL',
                'AM',
                'AP',
                'BA',
                'CE',
                'DF',
                'ES',
                'GO',
                'MA',
                'MG',
                'MS',
                'MT',
                'PA',
                'PB',
                'PE',
                'PI',
                'PR',
                'RJ',
                'RN',
                'RO',
                'RR',
                'RS',
                'SC',
                'SE',
                'TO'
            ];

            if (profile.vars._id) {
                if (profile.vars.sunday.status === false) {
                    profile.vars.sundayClosed = true;
                } else {
                    if (profile.vars.sunday.timeStart === profile.vars.sunday.timeEnd) {
                        profile.vars.sundayAllDay = true;
                    }

                    profile.vars.sundayStart = profile.vars.sunday.timeStart;
                    profile.vars.sundayEnd = profile.vars.sunday.timeEnd;
                }

                if (profile.vars.monday.status === false) {
                    profile.vars.mondayClosed = true;
                } else {
                    if (profile.vars.monday.timeStart === profile.vars.monday.timeEnd) {
                        profile.vars.mondayAllDay = true;
                    }

                    profile.vars.mondayStart = profile.vars.monday.timeStart;
                    profile.vars.mondayEnd = profile.vars.monday.timeEnd;
                }

                if (profile.vars.tuesday.status === false) {
                    profile.vars.tuesdayClosed = true;
                } else {
                    if (profile.vars.tuesday.timeStart === profile.vars.tuesday.timeEnd) {
                        profile.vars.tuesdayAllDay = true;
                    }

                    profile.vars.tuesdayStart = profile.vars.tuesday.timeStart;
                    profile.vars.tuesdayEnd = profile.vars.tuesday.timeEnd;
                }

                if (profile.vars.wednesday.status === false) {
                    profile.vars.wednesdayClosed = true;
                } else {
                    if (profile.vars.wednesday.timeStart === profile.vars.wednesday.timeEnd) {
                        profile.vars.wednesdayAllDay = true;
                    }

                    profile.vars.wednesdayStart = profile.vars.wednesday.timeStart;
                    profile.vars.wednesdayEnd = profile.vars.wednesday.timeEnd;
                }

                if (profile.vars.thursday.status === false) {
                    profile.vars.thursdayClosed = true;
                } else {
                    if (profile.vars.thursday.timeStart === profile.vars.thursday.timeEnd) {
                        profile.vars.thursdayAllDay = true;
                    }

                    profile.vars.thursdayStart = profile.vars.thursday.timeStart;
                    profile.vars.thursdayEnd = profile.vars.thursday.timeEnd;
                }

                if (profile.vars.friday.status === false) {
                    profile.vars.fridayClosed = true;
                } else {
                    if (profile.vars.friday.timeStart === profile.vars.friday.timeEnd) {
                        profile.vars.fridayAllDay = true;
                    }

                    profile.vars.fridayStart = profile.vars.friday.timeStart;
                    profile.vars.fridayEnd = profile.vars.friday.timeEnd;
                }

                if (profile.vars.saturday.status === false) {
                    profile.vars.saturdayClosed = true;
                } else {
                    if (profile.vars.saturday.timeStart === profile.vars.saturday.timeEnd) {
                        profile.vars.saturdayAllDay = true;
                    }

                    profile.vars.saturdayStart = profile.vars.saturday.timeStart;
                    profile.vars.saturdayEnd = profile.vars.saturday.timeEnd;
                }

                profile.vars.sundayMenu = profile.vars.sunday.sundayMenu;
                profile.vars.mondayMenu = profile.vars.monday.mondayMenu;
                profile.vars.tuesdayMenu = profile.vars.tuesday.tuesdayMenu;
                profile.vars.wednesdayMenu = profile.vars.wednesday.wednesdayMenu;
                profile.vars.thursdayMenu = profile.vars.thursday.thursdayMenu;
                profile.vars.fridayMenu = profile.vars.friday.fridayMenu;
                profile.vars.saturdayMenu = profile.vars.saturday.saturdayMenu;
            }
        },

        getMenu: {
            getMenu: function() {
                menuService.getMenu.save({ id: profileGet.id }, profile.functions.getMenu.successGetMenu);
            },

            successGetMenu: function(data) {
                profile.vars.listMenu = data.data;
            }
        },

        getProfile: {
            get: function() {
                profileService.getProfile.save({ id: profileGet.id }, profile.functions.getProfile.success)
            },

            success: function(data) {
                profile.vars = data.data;

                profile.functions.defineVars();
            }
        },

        zipCodeChange: function() {
            profile.vars.zipCode = profile.vars.zipCode.replace('-', '');
            if (profile.vars.zipCode.length >= 8) {
                zipCodeSearch.getDataBack.save(profile.vars, function(data) {
                    profile.vars.address = data.address.logradouro;
                    /*profile.vars.complement = data.address.complemento;*/
                    profile.vars.neighborhood = data.address.bairro;
                    profile.vars.city = data.address.localidade;
                    profile.vars.uf = data.address.uf;
                    profile.vars.lat = data.latlong.lat;
                    profile.vars.long = data.latlong.lng;
                    profile.vars.status = data.latlong.status;
                });
            }
        },

        changeHeaderImg : function () {
            Upload.upload({
                url: '/web/updateHeaderImgProfile',
                method: 'POST',
                data: {
                    file: profile.vars.headerImgProfile,
                    vars: profile.vars
                }
            }).then(function() {
                /*profile.functions.core();*/
            });
        },

        upload: function() {
            Upload.upload({
                url: '/web/updateProfile',
                method: 'POST',
                data: {
                    file: profile.vars.files,
                    vars: profile.vars
                }
            }).then(function() {
                dialogAlert.show({
                    title: 'Sucesso!',
                    content: 'Seu perfil foi atualizado com sucesso!',
                    ok: 'OK!'
                });

                profile.functions.core();
            });
        },

        save : function () {
            if(profile.vars.headerImgProfile){
                profile.functions.changeHeaderImg();
            }

            profile.functions.upload();
        }
    };

    profile.functions.core();
}
})();
(function(){
"use strict";
angular.module('profile')
    .service('profileService', profileService);

function profileService($resource, defineHost) {
    return {
        updateProfile : $resource(defineHost.host + '/web/updateProfile'),
        getProfile : $resource(defineHost.host + '/web/getProfile')
    }
}
})();
(function(){
"use strict";
angular.module('recoveryPassword', [])
    .controller('recoveryPasswordController', recoveryPassword);

function recoveryPassword($scope, recoveryPasswordService, dialogAlert, $stateParams, $state) {
    var recoveryPassword = this;
    recoveryPassword.vars = {};

    if(!$stateParams.q){
        $state.go('home');
    }else{
        recoveryPassword.functions = {
            core : function () {
                recoveryPassword.functions.defineVars();
                recoveryPassword.functions.watchMatch();
                recoveryPassword.functions.getHash.get();
            },

            defineVars : function () {
                recoveryPassword.vars.hashRecovery = $stateParams.q;
            },

            watchMatch : function () {
                $scope.$watchGroup(['recoveryPassword.vars.password', 'recoveryPassword.vars.repPassword'], function (value) {
                    if(value[0] !== value[1]){
                        $scope.formReset.password.$setValidity('notMatch', false);
                        $scope.formReset.repPassword.$setValidity('notMatch', false);
                    }else{
                        $scope.formReset.password.$setValidity('notMatch', true);
                        $scope.formReset.repPassword.$setValidity('notMatch', true);
                    }
                });
            },

            getHash : {
                get : function () {
                    recoveryPasswordService.recoveryPasswordGetHash.save(recoveryPassword.vars, recoveryPassword.functions.getHash.getSuccess);
                },

                getSuccess : function (data) {
                    switch (true){
                        case data.status === true:
                            recoveryPassword.vars.alert = false;
                            break;

                        case data.status === false:
                            recoveryPassword.vars.alert = true;
                            break;

                        default:
                            recoveryPassword.vars.alert = true;
                    }

                    if(recoveryPassword.vars.alert){
                        dialogAlert.show({
                            title : 'Atenção',
                            content : 'Você já atualizou sua senha, faça o login ou clique em "Esqueci minha senha"',
                            ok : 'Ok'
                        });

                        $state.go('home');
                    }
                }
            },

            resetPassword : {
                action : function () {
                    recoveryPasswordService.recoveryPassword.save(recoveryPassword.vars, recoveryPassword.functions.resetPassword.recoverySuccess);
                },

                recoverySuccess : function (data) {
                    switch (true){
                        case data.status === true:
                            recoveryPassword.vars.alert = true;
                            recoveryPassword.vars.alertError = false;
                            break;

                        case data.status === false:
                            recoveryPassword.vars.alert = false;
                            recoveryPassword.vars.alertError = true;
                            break;

                        default:
                            recoveryPassword.vars.alert = false;
                            recoveryPassword.vars.alertError = true;
                    }

                    if(recoveryPassword.vars.alertError){
                        dialogAlert.show({
                            title : 'Atenção',
                            content : 'Sua senha não foi atualizada, tente novamente"',
                            ok : 'Ok'
                        });
                    }else if(recoveryPassword.vars.alert){
                        dialogAlert.show({
                            title : 'Atenção',
                            content : 'Sua senha foi atualizada com sucesso! Faça o login com a nova senha"',
                            ok : 'Ok'
                        });

                        $state.go('home');
                    }
                }
            }
        };

        recoveryPassword.functions.core();
    }
}
})();
(function(){
"use strict";
angular.module('recoveryPassword')
    .service('recoveryPasswordService', recoveryPasswordService);

function recoveryPasswordService($resource, defineHost) {
    return {
        recoveryPasswordSend: $resource(defineHost.host + '/web/recoveryPasswordSend'),
        recoveryPasswordGetHash: $resource(defineHost.host + '/web/recoveryPasswordGetHash'),
        recoveryPassword: $resource(defineHost.host + '/web/recoveryPassword')
    }
}
})();
(function(){
"use strict";
angular.module('requests', [])
    .controller('requestsController', requests);

function requests($scope, $filter, profileGet, requestsService, toastAction, dialogAdvanced) {
    var requests = this;
    requests.vars = {};

    requests.functions = {
        core: function () {
            requests.functions.defineVars();
            requests.functions.socketConfig();
            requests.functions.getRequests.getRequests();
            requests.functions.getRequestsStop.getRequestsStop();
        },

        defineVars : function () {
            requests.vars.query = {
                order: '-dateInsert',
                limit: 100,
                page: 1
            };

            requests.vars.requestsList = [];
            requests.vars.listProductsInRequest = [];
        },

        socketConfig : function () {
            socket.on(profileGet.id, function (data) {
                switch (true){
                    case data.type === 'newProductInRequest':
                        data.data.products.forEach(function (value) {
                            if(requests.vars.listProductsInRequest.map(function(e) { return e.idRequest; }).indexOf(value._id) < 0){
                                requests.vars.listProductsInRequest.unshift({
                                    idRequest : value._id,
                                    productName : value.productID.productName,
                                    value : value.productID.value,
                                    promotionValue : value.productID.promotionValue,
                                    tableName : data.data.tableID.tableName,
                                    dateInsert : value.dateInsert
                                });
                                $scope.$apply();
                            }
                        });
                        break;

                    case data.type === 'requireStop':
                        requests.functions.getRequestsStop.getRequestsStop();
                }
            });
        },

        getRequests : {
            getRequests : function () {
                requestsService.getRequests.save(profileGet, requests.functions.getRequests.successGetRequests)
            },

            successGetRequests : function (data) {
                requests.vars.requestsList = data.requests;
                requests.functions.getRequests.treatmentBase();
            },

            treatmentBase : function () {
                requests.vars.requestsList.forEach(function (valueListProducts) {
                    if(valueListProducts.products.length > 0){
                        valueListProducts.products.forEach(function (valueProduct) {
                            if(!valueProduct.status){
                                requests.vars.listProductsInRequest.push({
                                    idRequest : valueProduct._id,
                                    productName : valueProduct.productID.productName,
                                    value : valueProduct.productID.value,
                                    promotionValue : valueProduct.productID.promotionValue,
                                    tableName : valueListProducts.tableID.tableName,
                                    dateInsert : valueProduct.dateInsert
                                })
                            }
                        })
                    }
                })
            }
        },

        getRequestsStop : {
            getRequestsStop : function () {
                requestsService.getRequestsStop.save(profileGet, requests.functions.getRequestsStop.successGetRequestStop)
            },

            successGetRequestStop : function (data) {
                requests.vars.listStopRequest = data.requests;
            },
        },

        checkSent : {
            checkSent: function (data) {
                requests.vars.toRemove = data;
                requestsService.checkProductSent.save(data, requests.functions.checkSent.successCheckSent);
            },

            successCheckSent : function (data) {
                if(data.status){
                    toastAction.show({
                        top : false,
                        bottom : true,
                        left : false,
                        right : true,
                        text : 'Produto marcado como entregue.',
                        scope : requests
                    });

                    if(requests.vars.listProductsInRequest.map(function(e) { return e.idRequest; }).indexOf(requests.vars.toRemove.idRequest) > -1){
                        requests.vars.listProductsInRequest.splice(requests.vars.listProductsInRequest.map(function(e) { return e.idRequest; }).indexOf(requests.vars.toRemove.idRequest), 1);
                    }
                }else{
                    toastAction.show({
                        top : false,
                        bottom : true,
                        left : false,
                        right : true,
                        text : 'Algo deu errado, tente novamente.',
                        scope : requests
                    });
                }


            }
        },

        moreDetailsRequest : function (data) {
            dialogAdvanced.show({
                controller : moreDetailsRequestController,
                controllerAs : 'moreDetailsRequest',
                clickOutsideToClose : false,
                templateUrl : 'templates/modules/requests/moreDetailsRequest.html',
                dataToDialog : data,
                functionThen : function () {
                    requests.functions.core();
                }
            });
        }
    };

    requests.functions.core();
}

function moreDetailsRequestController(data, dialogAdvanced, requestsService, toastAction) {
    var moreDetailsRequest = this;
    moreDetailsRequest.vars = {};

    moreDetailsRequest.functions = {
        core : function () {
            moreDetailsRequest.functions.defineVars();
        },

        defineVars : function () {
            moreDetailsRequest.vars.dataResume = data;
            moreDetailsRequest.vars.listProducts = [];
            moreDetailsRequest.vars.dataResume.products.forEach(function (value) {
                if(moreDetailsRequest.vars.listProducts.map(function(e) {
                        return e._id;
                    }).indexOf(value.productID._id) < 0) {
                    if(value.productID.promotionValue !== 'null'){
                        value.productID.realValue = value.productID.promotionValue
                    }else{
                        value.productID.realValue = value.productID.value
                    }

                    moreDetailsRequest.vars.listProducts.push({
                        _id : value.productID._id,
                        productName : value.productID.productName,
                        value : value.productID.realValue,
                        amount : 1
                    });
                }else{
                    moreDetailsRequest.vars.listProducts[moreDetailsRequest.vars.listProducts.map(function(e) { return e._id; }).indexOf(value.productID._id)].amount ++;
                }
            });

            if(moreDetailsRequest.vars.listProducts.length > 0){
                moreDetailsRequest.vars.total = 0;
                moreDetailsRequest.vars.listProducts.forEach(function (value) {
                    moreDetailsRequest.vars.total = moreDetailsRequest.vars.total + (value.value * value.amount);
                })
            }
        },

        hide : function () {
            dialogAdvanced.hide();
        },

        cancel : function () {
            dialogAdvanced.cancel();
        },

        closeRequest : {
            closeRequest: function () {
                requestsService.closeRequest.save(moreDetailsRequest.vars.dataResume, moreDetailsRequest.functions.closeRequest.successCloseRequest)
            },

            successCloseRequest : function (data) {
                if(data.status){
                    toastAction.show({
                        top : false,
                        bottom : true,
                        left : false,
                        right : true,
                        text : 'Pedido encerrado.',
                        scope : moreDetailsRequest
                    });

                    moreDetailsRequest.functions.hide();
                }else{
                    toastAction.show({
                        top : false,
                        bottom : true,
                        left : false,
                        right : true,
                        text : 'Algo deu errado, tente novamente.',
                        scope : moreDetailsRequest
                    });
                }
            }
        }
    };

    moreDetailsRequest.functions.core();
}
})();
(function(){
"use strict";
angular.module('requests')
    .service('requestsService', requestsService);

function requestsService($resource, defineHost) {
    return {
        getRequests: $resource(defineHost.host + '/web/getRequests'),
        checkProductSent: $resource(defineHost.host + '/web/checkProductSent'),
        getRequestsStop : $resource(defineHost.host + '/web/getRequestsStop'),
        closeRequest : $resource(defineHost.host + '/web/closeRequest')
    }
}
})();
(function(){
"use strict";
angular.module('tables', [])
    .controller('tablesController', tables);

function tables($scope, $filter, profileGet, tablesService, dialogAdvanced, dialogAlert, dialogConfirm) {
    var tables = this;
    tables.vars = {};

    tables.functions = {
        core : function () {
            tables.functions.getTables.getTables();
            tables.functions.search();
            tables.functions.defineVars();
        },

        defineVars : function () {
            tables.vars.filter = false;
            tables.vars.query = {
                order: '-tablesName',
                limit: 25,
                page: 1
            };
        },

        closeFilter : function () {
            tables.vars.filter = false;
            tables.vars.search = "";
        },

        search : function () {
            $scope.$watch('tables.vars.search', function (newvalue, oldvalue) {
                if(newvalue < oldvalue){
                    tables.vars.listTablesFilter = tables.vars.listTables
                }else{
                    tables.vars.listTablesFilter = $filter('filter')(tables.vars.listTables, {
                        tablesName : newvalue
                    });
                }
            });
        },

        getTables : {
            getTables : function () {
                tablesService.getTables.save({id : profileGet.id}, tables.functions.getTables.successGetTables);
            },

            successGetTables : function (data) {
                tables.vars.listTables = data.data;
                tables.vars.listTablesFilter = tables.vars.listTables;
            }
        },

        saveTable : function(data) {
            dialogAdvanced.show({
                controller : saveTableController,
                controllerAs : 'saveTable',
                templateUrl : 'templates/modules/tables/saveTable.html',
                clickOutsideToClose : false,
                dataToDialog : data,
                functionThen : function (edit) {
                    tables.functions.getTables.getTables();

                    if(edit){
                        dialogAlert.show({
                            title : 'Sucesso!',
                            content : 'Sua mesa foi atualizada com sucesso!',
                            ok : 'OK!'
                        });
                    }else{
                        dialogAlert.show({
                            title : 'Sucesso!',
                            content : 'Sua mesa foi criada com sucesso!',
                            ok : 'OK!'
                        });
                    }
                }
            });
        },

        deleteTable : function (data) {
            dialogConfirm.show({
                title : 'Atenção!',
                textContent : 'Deseja realmente deletar esta Mesa?',
                ok : 'Sim',
                cancel : 'Cancelar',
                confirmFunction : function () {
                    tablesService.deleteTables.save({tablesID : data}, function () {
                        dialogAlert.show({
                            title : 'Mesa deletada!',
                            content : 'Sua mesa foi deletada com sucesso.',
                            ok : 'OK'
                        });
                        tables.functions.getTables.getTables();
                    });
                }
            });
        },

        printQRCode : function (data) {
            dialogAdvanced.show({
                controller : printQRCode,
                controllerAs : 'printQRCode',
                templateUrl : 'templates/modules/tables/tablesPrint.html',
                clickOutsideToClose : false,
                dataToDialog : data,
                functionThen : function () {}
            });
        }
    };

    tables.functions.core();
}

function saveTableController(dialogAdvanced, tablesService, profileGet, data) {
    var saveTable = this;
    saveTable.vars = {};

    saveTable.functions = {
        core: function () {
            saveTable.functions.defineVars();
        },

        defineVars : function () {
            if(data){
                saveTable.vars.tableName = data.tableName;
                saveTable.vars.tablesID = data._id;
            }
        },

        hide : function () {
            dialogAdvanced.hide();
        },

        cancel : function () {
            dialogAdvanced.cancel();
        },

        save : {
            doSave : function () {
                tablesService.updateTables.save({id : profileGet.id, data : saveTable.vars}, saveTable.functions.save.successSaveTables);
            },

            successSaveTables : function (data) {
                saveTable.functions.hide(saveTable.vars.edit);
            }
        }
    };

    saveTable.functions.core();
}

function printQRCode(data, dialogAdvanced, profileGet) {
    var printQRCode = this;
    printQRCode.vars = {};

    printQRCode.functions = {
        core: function () {
            printQRCode.functions.defineVars();
        },

        defineVars : function () {
            printQRCode.vars = data;
            printQRCode.vars.profile = profileGet;
        },

        print : function () {
            printQRCode.vars.printContents = document.getElementById('print').innerHTML;
            printQRCode.vars.popupWin = window.open('', '_blank');
            printQRCode.vars.popupWin.document.open();
            printQRCode.vars.popupWin.document.write('<body onload="window.print()">' + printQRCode.vars.printContents + '</body>');
            printQRCode.vars.popupWin.document.close();
        },

        cancel : function () {
            dialogAdvanced.cancel();
        },

        hide : function () {
            dialogAdvanced.hide();
        }
    };

    printQRCode.functions.core();
}

})();
(function(){
"use strict";
angular.module('tables')
    .service('tablesService', tablesService);

function tablesService($resource, defineHost) {
    return {
        updateTables : $resource(defineHost.host + '/web/updateTables'),
        getTables : $resource(defineHost.host + '/web/getTables'),
        deleteTables : $resource(defineHost.host + '/web/deleteTables')
    }
}
})();