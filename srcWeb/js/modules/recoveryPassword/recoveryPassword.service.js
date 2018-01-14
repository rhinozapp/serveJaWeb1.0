angular.module('recoveryPassword')
    .service('recoveryPasswordService', recoveryPasswordService);

function recoveryPasswordService($resource, defineHost) {
    return {
        recoveryPasswordSend: $resource(defineHost.host + 'web/recoveryPasswordSend'),
        recoveryPasswordGetHash: $resource(defineHost.host + 'web/recoveryPasswordGetHash'),
        recoveryPassword: $resource(defineHost.host + 'web/recoveryPassword')
    }
}