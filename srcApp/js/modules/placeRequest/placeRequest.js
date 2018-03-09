angular.module('placeRequest', [])
    .controller('placeRequestController', placeRequestController);

function placeRequestController($stateParams, $state, placeService, placeRequestService, toastAction) {
    var placeRequest = this;
    placeRequest.vars = {};

    placeRequest.functions = {
        core : function () {
            placeRequest.functions.defineVars().then(function () {
                placeRequest.functions.getCategory().then(function () {
                    placeRequest.functions.defineMenu();
                    placeRequest.functions.getMenu.getMenu();
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
                                placeRequest.vars.listByCategory[keyCat].products.push({
                                    productID: valueProd._id,
                                    productName: valueProd.productName,
                                    value : valueProd.value,
                                    promotionValue : valueProd.promotionValue,
                                    imgPath : valueProd.imgPath,
                                    amountInRequest : 0
                                });
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
                                amountInRequest : 0
                            })
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
        }
    };

    placeRequest.functions.core();
}