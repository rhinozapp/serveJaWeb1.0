angular.module('products', [])
    .controller('productsController', products);

function products($scope, $filter, productsService, profileGet, dialogAdvanced, dialogAlert, dialogConfirm) {
    var products = this;
    products.vars = {};

    products.functions = {
        core : function () {
            products.functions.getCategory.getCategory();
            products.functions.get.getProduct();
            products.functions.search();
            products.functions.defineVars();
        },

        defineVars : function () {
            products.vars.filter = false;
            products.vars.query = {
                order: '-productName',
                limit: 25,
                page: 1
            };
        },

        closeFilter : function () {
            products.vars.filter = false;
            products.vars.search = "";
        },

        search : function () {
            $scope.$watch('products.vars.search', function (newvalue, oldvalue) {
                if(newvalue < oldvalue){
                    products.vars.listProductsFilter = products.vars.listProducts
                }else{
                    products.vars.listProductsFilter = $filter('filter')(products.vars.listProducts, {
                        productName : newvalue
                    });
                }
            });
        },

        get : {
            getProduct : function () {
                productsService.getProducts.save({id : profileGet.id}, products.functions.get.successGetProducts);
            },

            successGetProducts : function (data) {
                products.vars.listProducts = data.data;
                products.vars.listProductsFilter = products.vars.listProducts;

                if(products.vars.listCategory){
                    products.vars.listProductsFilter.forEach(function (valueProd) {
                        products.vars.listCategory.forEach(function (valueCat) {
                            if(valueProd.categoryID === valueCat._id){
                                valueProd.nameCategory = valueCat.categoryName
                            }
                        });
                    });
                }
            }
        },

        getCategory : {
            getCategory : function () {
                productsService.getCategory.save({id : profileGet.id}, products.functions.getCategory.successGetCategory);
            },

            successGetCategory : function (data) {
                products.vars.listCategory = data.data;
            }
        },

        saveProducts : function(data) {
            dialogAdvanced.show({
                controller : saveProductsController,
                controllerAs : 'saveProducts',
                templateUrl : 'templates/modules/products/saveProducts.html',
                clickOutsideToClose : false,
                dataToDialog : data,
                functionThen : function (showSuccess) {
                    if(showSuccess){
                        dialogAlert.show({
                            title : 'Sucesso!',
                            content : 'Seu produto foi criado com sucesso!',
                            ok : 'OK!'
                        });
                    }
                    products.functions.get.getProduct();
                }
            });
        },

        createCategory : function() {
            dialogAdvanced.show({
                controller : saveCategoryController,
                controllerAs : 'saveCategory',
                templateUrl : 'templates/modules/products/saveCategory.html',
                clickOutsideToClose : false
            });
        },

        deleteProduct : function (data) {
            dialogConfirm.show({
                title : 'Atenção!',
                textContent : 'Deseja realmente deletar este produto?',
                ok : 'Sim',
                cancel : 'Cancelar',
                confirmFunction : function () {
                    productsService.deleteProducts.save({id : data}, function () {
                        dialogAlert.show({
                            title : 'Produto deletado!',
                            content : 'Seu produto foi deletado com sucesso.',
                            ok : 'OK'
                        });
                        products.functions.get.getProduct();
                    });
                }
            });
        }
    };

    products.functions.core();
}

function saveProductsController($scope, dialogAdvanced, toastAction, productsService, profileGet, data, Upload) {
    var saveProducts = this;
    saveProducts.vars = {};

    saveProducts.functions = {
        core : function () {
            saveProducts.functions.defineVars();
            saveProducts.functions.getCategory.getCategory();
        },

        defineVars : function () {
            if(data){
                saveProducts.vars = data;
                saveProducts.vars.value = Number(saveProducts.vars.value);
                saveProducts.vars.promotionValue = Number(saveProducts.vars.promotionValue);
                saveProducts.vars.amount = Number(saveProducts.vars.amount);
            }
        },

        hide : function (showSuccess) {
            saveProducts.vars = {};
            dialogAdvanced.hide(showSuccess);
        },

        cancel : function () {
            saveProducts.vars = {};
            dialogAdvanced.cancel();
        },

        getCategory : {
            getCategory : function () {
                productsService.getCategory.save({id : profileGet.id}, saveProducts.functions.getCategory.successGetCategory);
            },

            successGetCategory : function (data) {
                saveProducts.vars.listCategory = data.data;
            }
        },

        save : {
            doSave : function () {
                Upload.upload({
                    url: '/web/saveProducts',
                    method: 'POST',
                    data: {
                        file: saveProducts.vars.files,
                        vars : saveProducts.vars,
                        id : profileGet.id
                    }
                }).then(saveProducts.functions.save.successSaveProducts);
            },

            successSaveProducts : function (data) {
                saveProducts.functions.hide(true);
            }
        },

        saveAndNew : {
            doSave : function () {
                Upload.upload({
                    url: '/web/saveProducts',
                    method: 'POST',
                    data: {
                        file: saveProducts.vars.files,
                        vars : saveProducts.vars,
                        id : profileGet.id
                    }
                }).then(saveProducts.functions.saveAndNew.successSaveProducts);
            },

            successSaveProducts : function (data) {
                toastAction.show({
                    top : false,
                    bottom : true,
                    left : false,
                    right : true,
                    text : 'Produto salvo!',
                    scope : saveProducts
                });
                $scope.saveProductsForm.value.$touched = false;
                $scope.saveProductsForm.nameProduct.$touched = false;
                $scope.saveProductsForm.category.$touched = false;
                saveProducts.vars = {};
                saveProducts.functions.getCategory.getCategory();
            }
        }
    };

    saveProducts.functions.core();
}

function saveCategoryController(dialogAdvanced, productsService, profileGet) {
    var saveCategory = this;
    saveCategory.vars = {};

    saveCategory.functions = {
        core : function () {
            saveCategory.functions.get.getCategory();
            saveCategory.functions.defineVars();
        },

        defineVars : function () {
            saveCategory.vars.filter = false;
            saveCategory.vars.query = {
                order: '-categoryName',
                limit: 10,
                page: 1
            };
        },

        hide : function () {
            saveCategory.vars = {};
            dialogAdvanced.hide();
        },

        cancel : function () {
            saveCategory.vars = {};
            dialogAdvanced.cancel();
        },

        get : {
            getCategory : function () {
                productsService.getCategory.save({id : profileGet.id}, saveCategory.functions.get.successGetCategory);
            },

            successGetCategory : function (data) {
                saveCategory.vars.listCategory = data.data;
            }
        },

        save : {
            doSave : function () {
                productsService.saveCategory.save({id : profileGet.id, data : saveCategory.vars}, saveCategory.functions.save.successSave);
            },

            successSave : function (data) {
                saveCategory.vars = {};
                saveCategory.functions.core();
            }
        },

        edit : {
            selectEdit : function (data) {
                saveCategory.vars.categoryID = data._id;
                saveCategory.vars.categoryName = data.categoryName;
                saveCategory.vars.editMode = true;
            },

            backToCreate : function () {
                saveCategory.vars = {};
                saveCategory.functions.core();
            }
        },

        delete : {
            deleteCategory : function (data) {
                saveCategory.vars.categoryID = data._id;
                productsService.deleteCategory.save(saveCategory.vars, saveCategory.functions.delete.successDeleteCategory);
            },

            successDeleteCategory : function () {
                saveCategory.vars = {};
                saveCategory.functions.core();
            }
        }
    };

    saveCategory.functions.core();
}