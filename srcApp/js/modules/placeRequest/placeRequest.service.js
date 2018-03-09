angular.module('placeRequest')
    .service('placeRequestService', placeRequestService);

function placeRequestService($resource, defineHost) {
    return {
        addProductsInRequest : $resource(defineHost.host + '/app/addProductsInRequest')
    }
}