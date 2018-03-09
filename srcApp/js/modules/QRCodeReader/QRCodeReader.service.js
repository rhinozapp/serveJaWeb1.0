angular.module('QRCodeReader')
    .service('QRCodeReaderService', QRCodeReaderService);

function QRCodeReaderService($resource, defineHost) {
    return {
        checkTableValid : $resource(defineHost.host + '/app/checkTableValid'),
        startRequest : $resource(defineHost.host + '/app/startRequest')
    }
}