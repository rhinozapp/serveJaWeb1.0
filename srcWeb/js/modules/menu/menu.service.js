angular.module('menu')
    .service('menuService', menuService);

function menuService($resource, defineHost) {
    return {
        updateMenu : $resource(defineHost.host + 'web/updateMenu'),
        getMenu : $resource(defineHost.host + 'web/getMenu'),
        deleteMenu : $resource(defineHost.host + 'web/deleteMenu')
    }
}