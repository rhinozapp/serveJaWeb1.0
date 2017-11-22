angular
    .module('core')
    .service('profileGet', function ($window, jwtHelper) {
        var profile = jwtHelper.decodeToken($window.localStorage.token);
        return {
            id : profile.id,
            email: profile.email,
            name : profile.name
        }
    });