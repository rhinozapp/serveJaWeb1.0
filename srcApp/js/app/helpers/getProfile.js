angular
    .module('core')
    .service('getProfile', function ($window, jwtHelper) {
        if($window.localStorage.token){
            var profile = jwtHelper.decodeToken($window.localStorage.token);
            return {
                email:profile.email,
                idFace:profile.idFace,
                name:profile.name,
                photo:profile.photo,
                token:profile.token,
                status : true
            }
        }else{
            return {
                status : false
            }
        }

    });