angular.module('placeRequest')
    .service('placeRequestService', placeRequestService);

function placeRequestService($resource, defineHost) {
    return {
        addProductsInRequest : $resource(defineHost.host + '/app/addProductsInRequest'),
        requireClose : $resource(defineHost.host + '/app/requireClose'),
        getListProductsRequest : $resource(defineHost.host + '/app/getListProductsRequest')
    }
}