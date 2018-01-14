angular.module('products')
    .service('productsService', productsService);

function productsService($resource, defineHost) {
    return {
        saveProducts : $resource(defineHost.host + 'web/saveProducts'),
        getProducts : $resource(defineHost.host + 'web/getProducts'),
        deleteProducts : $resource(defineHost.host + 'web/deleteProducts'),
        saveCategory : $resource(defineHost.host + 'web/saveCategory'),
        getCategory : $resource(defineHost.host + 'web/getCategory'),
        deleteCategory : $resource(defineHost.host + 'web/deleteCategory')
    }
}