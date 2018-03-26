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
                console.log(data, requests.vars.requestsList);
                switch (true){
                    case data.type === 'newProductInRequest':
                        data.data.products.forEach(function (value) {
                            if(requests.vars.listProductsInRequest.map(function(e) { return e.idRequest; }).indexOf(value._id) < 0){
                                if(!value.status){
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
                            }

                            if(requests.vars.requestsList.length > 0){
                                requests.vars.requestsList.forEach(function (valueList) {
                                    if(valueList.products.map(function(e) { return e._id; }).indexOf(value._id) < 0){
                                        valueList.products.unshift(value);
                                    }
                                });
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