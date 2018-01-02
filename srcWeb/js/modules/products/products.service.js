angular.module('products')
    .service('productsService', productsService);

function productsService($resource) {
    return {
        saveProducts : $resource('web/saveProducts'),
        getProducts : $resource('web/getProducts'),
        deleteProducts : $resource('web/deleteProducts'),
        saveCategory : $resource('web/saveCategory'),
        getCategory : $resource('web/getCategory'),
        deleteCategory : $resource('web/deleteCategory')
    }
}