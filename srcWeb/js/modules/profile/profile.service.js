angular.module('profile')
    .service('profileService', profileService);

function profileService($resource) {
    return {
        updateProfile : $resource('web/updateProfile'),
        getProfile : $resource('web/getProfile')
    }
}