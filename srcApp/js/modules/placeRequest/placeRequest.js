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
                dialogAdvanced.show({
                    controller : resumeToEndController,
                    controllerAs : 'resumeToEnd',
                    templateUrl : 'templates/modules/placeRequest/resumeToEnd.html',
                    clickOutsideToClose : false,
                    dataToDialog : data.data,
                    functionThen : function (data) {
                        if(data.status){
                            //cancelar
                        }
                    }
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

function resumeToEndController(data, dialogAdvanced) {
    var resumeToEnd = this;
    resumeToEnd.vars = {};

    resumeToEnd.functions = {
        core : function () {
            resumeToEnd.functions.defineVars();
        },

        defineVars : function () {
            resumeToEnd.vars.dataResume = data;
            resumeToEnd.vars.listProducts = [];
            resumeToEnd.vars.dataResume.products.forEach(function (value) {
                if(resumeToEnd.vars.listProducts.map(function(e) {
                    return e._id;
                }).indexOf(value.productID._id) < 0) {
                    if(value.productID.promotionValue !== 'null'){
                        value.productID.realValue = value.productID.promotionValue
                    }else{
                        value.productID.realValue = value.productID.value
                    }

                    resumeToEnd.vars.listProducts.push({
                        _id : value.productID._id,
                        productName : value.productID.productName,
                        value : value.productID.realValue,
                        amount : 1
                    });
                }else{
                    resumeToEnd.vars.listProducts[resumeToEnd.vars.listProducts.map(function(e) { return e._id; }).indexOf(value.productID._id)].amount ++;
                }
            });

            if(resumeToEnd.vars.listProducts.length > 0){
                resumeToEnd.vars.total = 0;
                resumeToEnd.vars.listProducts.forEach(function (value) {
                    resumeToEnd.vars.total = resumeToEnd.vars.total + (value.value * value.amount);
                })
            }
        }
    };

    resumeToEnd.functions.core();
}