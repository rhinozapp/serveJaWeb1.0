angular.module('place')
    .service('placeService', placeService);

function placeService($resource, defineHost) {
    return {
        get : $resource(/*defineHost.host + */'/app/getListPubs')
    }
}