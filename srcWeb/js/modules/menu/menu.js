angular.module('menu', [])
    .controller('menuController', menu);

function menu($scope, $filter, menuService, profileGet, dialogAdvanced, dialogAlert, dialogConfirm) {
    var menu = this;
    menu.vars = {};

    menu.functions = {
        core : function () {
            menu.functions.get.getMenu();
            menu.functions.search();
            menu.functions.defineVars();
        },

        defineVars : function () {
            menu.vars.filter = false;
            menu.vars.query = {
                order: '-menuName',
                limit: 25,
                page: 1
            };
        },

        closeFilter : function () {
            menu.vars.filter = false;
            menu.vars.search = "";
        },

        search : function () {
            $scope.$watch('menu.vars.search', function (newvalue, oldvalue) {
                if(newvalue < oldvalue){
                    menu.vars.listMenuFilter = menu.vars.listMenu
                }else{
                    menu.vars.listMenuFilter = $filter('filter')(menu.vars.listMenu, {
                        menuName : newvalue
                    });
                }
            });
        },

        get : {
            getMenu : function () {
                menuService.getMenu.save({id : profileGet.id}, menu.functions.get.successGetMenu);
            },

            successGetMenu : function (data) {
                menu.vars.listMenu = data.data;
                menu.vars.listMenuFilter = menu.vars.listMenu;
            }
        },

        saveMenu : function(data) {
            dialogAdvanced.show({
                controller : saveMenuController,
                controllerAs : 'saveMenu',
                templateUrl : 'templates/modules/menu/saveMenu.html',
                clickOutsideToClose : false,
                dataToDialog : data,
                functionThen : function (edit) {
                    menu.functions.get.getMenu();

                    if(edit){
                        dialogAlert.show({
                            title : 'Sucesso!',
                            content : 'Seu cardápio foi atualizado com sucesso!',
                            ok : 'OK!'
                        });
                    }else{
                        dialogAlert.show({
                            title : 'Sucesso!',
                            content : 'Seu cardápio foi criado com sucesso!',
                            ok : 'OK!'
                        });
                    }
                }
            });
        },

        deleteMenu : function (data) {
            dialogConfirm.show({
                title : 'Atenção!',
                textContent : 'Deseja realmente deletar este cardápio?',
                ok : 'Sim',
                cancel : 'Cancelar',
                confirmFunction : function () {
                    menuService.deleteMenu.save({menuID : data}, function () {
                        dialogAlert.show({
                            title : 'Cardápio deletado!',
                            content : 'Seu cardápio foi deletado com sucesso.',
                            ok : 'OK'
                        });
                        menu.functions.get.getMenu();
                    });
                }
            });
        }
    };

    menu.functions.core();
}

function saveMenuController(dialogAdvanced, menuService, productsService, profileGet, data) {
    var saveMenu = this;
    saveMenu.vars = {};

    saveMenu.functions = {
        core : function () {
            saveMenu.functions.defineVars();
            saveMenu.functions.getCategory.getCategory();
            saveMenu.functions.getProduct.getProduct();
        },

        defineVars : function () {
            saveMenu.vars.listOrder = [];
            if(data){
                saveMenu.vars.menuName = data.menuName;
                saveMenu.vars.menuID = data._id;
                saveMenu.vars.dataList = [];
                saveMenu.vars.edit = true;

                data.productsID.forEach(function (valueData) {
                    saveMenu.vars.dataList.push(valueData.productID);
                });
            }
        },

        hide : function () {
            dialogAdvanced.hide();
        },

        cancel : function () {
            dialogAdvanced.cancel();
        },

        getCategory : {
            getCategory : function () {
                productsService.getCategory.save({id : profileGet.id}, saveMenu.functions.getCategory.successGetCategory);
            },

            successGetCategory : function (data) {
                saveMenu.vars.listCategory = data.data;
            }
        },

        getProduct : {
            getProduct : function () {
                productsService.getProducts.save({id : profileGet.id}, saveMenu.functions.getProduct.successGetProducts);
            },

            successGetProducts : function (result) {
                saveMenu.vars.listProducts = result.data;

                if(saveMenu.vars.listCategory){
                    saveMenu.vars.listCategory.forEach(function (valueCat, keyCat) {

                        saveMenu.vars.listOrder.push({
                            categoryName : valueCat.categoryName,
                            products: []
                        });

                        saveMenu.vars.listProducts.forEach(function (valueProd) {
                            if(valueCat._id === valueProd.categoryID){
                                if(data){
                                    if(saveMenu.vars.dataList.indexOf(valueProd._id) >= 0){
                                        saveMenu.vars.listOrder[keyCat].products.push({
                                            productID : valueProd._id,
                                            productName : valueProd.productName,
                                            statusInMenu : true
                                        });
                                    }else{
                                        saveMenu.vars.listOrder[keyCat].products.push({
                                            productID : valueProd._id,
                                            productName : valueProd.productName
                                        });
                                    }
                                }else{
                                    saveMenu.vars.listOrder[keyCat].products.push({
                                        productID : valueProd._id,
                                        productName : valueProd.productName
                                    });
                                }
                            }
                        });
                    });
                }
            }
        },

        save : {
            doSave : function () {
                menuService.updateMenu.save({id : profileGet.id, data : saveMenu.vars.listOrder, name : saveMenu.vars.menuName, menuID : saveMenu.vars.menuID}, saveMenu.functions.save.successSaveProducts);
            },

            successSaveProducts : function (data) {
                saveMenu.functions.hide(saveMenu.vars.edit);
            }
        }
    };

    saveMenu.functions.core();
}