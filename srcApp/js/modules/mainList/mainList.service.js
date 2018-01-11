angular.module('mainList')
    .service('mainListService', mainListService);

function mainListService($resource, defineHost) {
    return {
        get : $resource(defineHost.host + '/app/getListPubs')
    }
}