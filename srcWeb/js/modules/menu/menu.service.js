angular.module('menu')
    .service('menuService', menuService);

function menuService($resource) {
    return {
        updateMenu : $resource('web/updateMenu'),
        getMenu : $resource('web/getMenu'),
        deleteMenu : $resource('web/deleteMenu')
    }
}