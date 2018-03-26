angular.module('place')
    .service('placeService', placeService);

function placeService($resource, defineHost) {
    return {
        getMenu : $resource(defineHost.host + '/app/getMenu'),
        getCategory : $resource(defineHost.host + '/app/getCategory'),
        notFavorite : $resource(defineHost.host + '/app/notFavorite', {
            ignoreLoadingBar: true
        }),
        markFavorite : $resource(defineHost.host + '/app/markFavorite', {
            ignoreLoadingBar: true
        })
    }
}