angular.module('requests')
    .service('requestsService', requestsService);

function requestsService($resource, defineHost) {
    return {
        getRequests: $resource(defineHost.host + '/web/getRequests'),
        checkProductSent: $resource(defineHost.host + '/web/checkProductSent')
    }
}