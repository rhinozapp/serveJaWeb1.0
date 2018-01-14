angular.module('tables')
    .service('tablesService', tablesService);

function tablesService($resource, defineHost) {
    return {
        updateTables : $resource(defineHost.host + 'web/updateTables'),
        getTables : $resource(defineHost.host + 'web/getTables'),
        deleteTables : $resource(defineHost.host + 'web/deleteTables')
    }
}