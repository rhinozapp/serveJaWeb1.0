angular.module('profile')
    .service('profileService', profileService);

function profileService($resource, defineHost) {
    return {
        updateProfile : $resource(defineHost.host + '/web/updateProfile'),
        getProfile : $resource(defineHost.host + '/web/getProfile')
    }
}