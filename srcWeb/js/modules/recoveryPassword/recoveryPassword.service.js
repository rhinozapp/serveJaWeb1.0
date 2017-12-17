angular.module('recoveryPassword')
    .service('recoveryPasswordService', recoveryPasswordService);

function recoveryPasswordService($resource) {
    return {
        recoveryPasswordSend: $resource('web/recoveryPasswordSend'),
        recoveryPasswordGetHash: $resource('web/recoveryPasswordGetHash'),
        recoveryPassword: $resource('web/recoveryPassword')
    }
}