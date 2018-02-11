angular.module('mainList')
    .service('mainListService', mainListService);

function mainListService($resource, defineHost) {
    return {
        getListPubs : $resource(defineHost.host + '/app/getListPubs'),
        getListPubsFavorites : $resource(defineHost.host + '/app/getListPubsFavorites')
    }
}