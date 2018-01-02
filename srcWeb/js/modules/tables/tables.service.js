angular.module('tables')
    .service('tablesService', tablesService);

function tablesService($resource) {
    return {
        updateTables : $resource('web/updateTables'),
        getTables : $resource('web/getTables'),
        deleteTables : $resource('web/deleteTables')
    }
}