angular.module('requests', [])
    .controller('requestsController', requests);

function requests($scope, $filter, profileGet, requestsService, toastAction) {
    var requests = this;
    requests.vars = {};

    requests.functions = {
        core: function () {
            requests.functions.defineVars();
            requests.functions.getRequests.getRequests();
            requests.functions.socketConfig();
        },

        defineVars : function () {
            requests.vars.query = {
                order: '-dateInsert',
                limit: 100,
                page: 1
            };

            requests.vars.listProducts = [];
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

                    case data.type === '':
                }
            });
        },

        getRequests : {
            getRequests : function () {
                requestsService.getRequests.save(profileGet, requests.functions.getRequests.successGetRequests)
            },

            successGetRequests : function (data) {
                requests.vars.listProducts = data.requests;
                requests.functions.treatmentBase();
            }
        },

        treatmentBase : function () {
            requests.vars.listProducts.forEach(function (valueListProducts) {
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
        }
    };

    requests.functions.core();
}