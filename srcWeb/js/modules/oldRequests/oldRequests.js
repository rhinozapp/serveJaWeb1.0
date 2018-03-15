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