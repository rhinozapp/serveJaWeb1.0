angular
    .module('core')
    .service('getRequestStatus', function ($resource, defineHost) {
        return {
            checkRequestStatus : $resource(defineHost.host + '/app/checkRequestStatus')
        }
    });