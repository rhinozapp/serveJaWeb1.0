angular.module('place')
    .service('placeService', placeService);

function placeService($resource, defineHost) {
    return {
        getMenu : $resource(defineHost.host + '/app/getMenu'),
        getCategory : $resource(defineHost.host + '/app/getCategory')
    }
}