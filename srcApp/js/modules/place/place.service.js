angular.module('place')
    .service('placeService', placeService);

function placeService($resource, defineHost) {
    return {
        getMenu : $resource(defineHost.host + '/app/getMenu'),
        getCategory : $resource(defineHost.host + '/app/getCategory'),
        notFavorite : $resource(defineHost.host + '/app/notFavorite'),
        markFavorite : $resource(defineHost.host + '/app/markFavorite')
    }
}