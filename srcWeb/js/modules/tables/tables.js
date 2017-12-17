angular.module('tables', [])
    .controller('tablesController', tables);

function tables($scope, $filter, profileGet, tablesService, dialogAdvanced, dialogAlert, dialogConfirm) {
    var tables = this;
    tables.vars = {};

    tables.functions = {
        core : function () {
            tables.functions.getTables.getTables();
            tables.functions.search();
            tables.functions.defineVars();
        },

        defineVars : function () {
            tables.vars.filter = false;
            tables.vars.query = {
                order: '-tablesName',
                limit: 25,
                page: 1
            };
        },

        closeFilter : function () {
            tables.vars.filter = false;
            tables.vars.search = "";
        },

        search : function () {
            $scope.$watch('tables.vars.search', function (newvalue, oldvalue) {
                if(newvalue < oldvalue){
                    tables.vars.listTablesFilter = tables.vars.listTables
                }else{
                    tables.vars.listTablesFilter = $filter('filter')(tables.vars.listTables, {
                        tablesName : newvalue
                    });
                }
            });
        },

        getTables : {
            getTables : function () {
                tablesService.getTables.save({id : profileGet.id}, tables.functions.getTables.successGetTables);
            },

            successGetTables : function (data) {
                tables.vars.listTables = data.data;
                tables.vars.listTablesFilter = tables.vars.listTables;
            }
        },

        saveTable : function(data) {
            dialogAdvanced.show({
                controller : saveTableController,
                controllerAs : 'saveTable',
                templateUrl : 'templates/modules/tables/saveTable.html',
                clickOutsideToClose : false,
                dataToDialog : data,
                functionThen : function (edit) {
                    tables.functions.getTables.getTables();

                    if(edit){
                        dialogAlert.show({
                            title : 'Sucesso!',
                            content : 'Sua mesa foi atualizada com sucesso!',
                            ok : 'OK!'
                        });
                    }else{
                        dialogAlert.show({
                            title : 'Sucesso!',
                            content : 'Sua mesa foi criada com sucesso!',
                            ok : 'OK!'
                        });
                    }
                }
            });
        },

        deleteTable : function (data) {
            dialogConfirm.show({
                title : 'Atenção!',
                textContent : 'Deseja realmente deletar esta Mesa?',
                ok : 'Sim',
                cancel : 'Cancelar',
                confirmFunction : function () {
                    tablesService.deleteTables.save({tablesID : data}, function () {
                        dialogAlert.show({
                            title : 'Mesa deletada!',
                            content : 'Sua mesa foi deletada com sucesso.',
                            ok : 'OK'
                        });
                        tables.functions.getTables.getTables();
                    });
                }
            });
        }
    };

    tables.functions.core();
}

function saveTableController(dialogAdvanced, tablesService, profileGet, data) {
    var saveTable = this;
    saveTable.vars = {};

    saveTable.functions = {
        core: function () {
            saveTable.functions.defineVars();
        },

        defineVars : function () {
            if(data){
                saveTable.vars.tableName = data.tableName;
                saveTable.vars.tablesID = data._id;
            }
        },

        hide : function () {
            dialogAdvanced.hide();
        },

        cancel : function () {
            dialogAdvanced.cancel();
        },

        save : {
            doSave : function () {
                tablesService.updateTables.save({id : profileGet.id, data : saveTable.vars}, saveTable.functions.save.successSaveTables);
            },

            successSaveTables : function (data) {
                saveTable.functions.hide(saveTable.vars.edit);
            }
        }
    };

    saveTable.functions.core();
}
