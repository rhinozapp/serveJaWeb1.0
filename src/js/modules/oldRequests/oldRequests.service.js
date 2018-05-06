angular.module('oldRequests')
    .service('oldRequestsService', oldRequestsService);

function oldRequestsService($resource, defineHost) {
    return {
        getOldRequests: $resource(defineHost.host + '/web/getOldRequests')
    }
}