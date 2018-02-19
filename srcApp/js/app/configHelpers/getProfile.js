angular
    .module('core')
    .service('getProfile', function ($window, jwtHelper) {
        if($window.localStorage.token){
            var profile = jwtHelper.decodeToken($window.localStorage.token);
            return {
                id : profile.id,
                emailFace: profile.emailFace,
                emailGoogle: profile.emailGoogle,
                name : profile.name,
                photo : profile.photo,
                tokenFace : profile.tokenFace,
                tokenGoogle : profile.tokenGoogle,
                idFace : profile.idFace,
                idGoogle : profile.idGoogle,
                status : true
            }
        }else{
            return {
                status : false
            }
        }

    });