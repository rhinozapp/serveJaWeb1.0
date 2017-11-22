(function(){
"use strict";
angular.module('modules', [
    'home',
    'mainControl',
    'profile'
]);
})();
(function(){
"use strict";
angular.module('home', [])
    .controller('homeController', home);

function home(dialogAdvanced) {
    var home = this;

    home.functions = {
        core : function () {},

        doLogin : function () {
            dialogAdvanced.show({
                controller : loginController,
                controllerAs : 'login',
                templateUrl : 'templates/modules/home/loginDialog.html',
                clickOutsideToClose : false
                /*functionThen : function () {}*/
            });
        },

        signUp : function () {
            dialogAdvanced.show({
                controller : signUPController,
                controllerAs : 'signUP',
                templateUrl : 'templates/modules/home/signUPDialog.html',
                clickOutsideToClose : false
                /*functionThen : function () {}*/
            });
        }
    };

    home.functions.core();
}

function loginController(dialogAdvanced, loginService, dialogAlert, $window) {
    var login = this;
    login.vars = {};

    login.functions = {
        core : function () {},

        loginAction : function () {
            loginService.doLogin.save(login.vars, function (data) {
                console.log(data.status === true);
                switch (true){
                    case data.status === true:
                        login.vars.alert = false;

                        $window.localStorage.token = data.token;
                        $window.location.reload();
                        break;

                    case data.status === false:
                        login.vars.alert = true;
                        login.vars.message = 'Alguma coisa deu errado, tente novamente :(';
                        break;

                    default:
                        login.vars.alert = true;
                        login.vars.message = 'Alguma coisa deu errado, tente novamente :(';
                }

                if(login.vars.alert){
                    dialogAlert.show({
                        title : 'Atenção',
                        content : login.vars.message,
                        ok : 'Ok'
                    });
                }
            });
        },

        signUP : function () {
            dialogAdvanced.show({
                controller : signUPController,
                controllerAs : 'signUP',
                templateUrl : 'templates/modules/home/signUPDialog.html',
                clickOutsideToClose : false
                /*functionThen : function () {}*/
            });
        },

        cancel : function () {
            dialogAdvanced.cancel();
        }
    };
}

function signUPController(dialogAdvanced, loginService, zipCodeSearch, $scope, dialogAlert, $window) {
    var signUP = this;
    signUP.vars = {};

    signUP.functions = {
        core : function () {
            signUP.functions.defineVars();
            signUP.functions.watchMatch();
        },

        defineVars : function () {
            signUP.vars.listUF = [
                'SP',
                'AC',
                'AL',
                'AM',
                'AP',
                'BA',
                'CE',
                'DF',
                'ES',
                'GO',
                'MA',
                'MG',
                'MS',
                'MT',
                'PA',
                'PB',
                'PE',
                'PI',
                'PR',
                'RJ',
                'RN',
                'RO',
                'RR',
                'RS',
                'SC',
                'SE',
                'TO'
            ];
        },

        watchMatch : function () {
            $scope.$watchGroup(['signUP.vars.password', 'signUP.vars.repPassword'], function (value) {
                if(value[0] !== value[1]){
                    $scope.adminSignUp.password.$setValidity('notMatch', false);
                    $scope.adminSignUp.repPassword.$setValidity('notMatch', false);
                }else{
                    $scope.adminSignUp.password.$setValidity('notMatch', true);
                    $scope.adminSignUp.repPassword.$setValidity('notMatch', true);
                }
            });
        },

        zipCodeChange : function () {
            signUP.vars.zipCode = signUP.vars.zipCode.replace('-', '');
            if(signUP.vars.zipCode.length >= 8){
                zipCodeSearch.getData(signUP.vars).then(function (data) {
                    signUP.vars.address = data.address.logradouro;
                    signUP.vars.complement = data.address.complemento;
                    signUP.vars.neighborhood = data.address.bairro;
                    signUP.vars.city = data.address.localidade;
                    signUP.vars.uf = data.address.uf;
                    signUP.vars.lat = data.latlong.lat;
                    signUP.vars.long = data.latlong.lng;
                });
            }
        },

        signUPAction : function () {
            loginService.signUP.save(signUP.vars, function (data) {
                switch (true){
                    case data.status === true:
                        signUP.vars.message = 'Você foi cadastrado com sucesso!';
                        $window.localStorage.token = data.token;
                        $window.location.reload();
                        break;

                    case data.status === false:
                        signUP.vars.message = 'Alguma coisa deu errado, tente novamente :(!';
                        break;

                    default:
                        signUP.vars.message = 'Alguma coisa deu errado, tente novamente :(!';
                }

                dialogAlert.show({
                    title : 'Atenção',
                    content : signUP.vars.message,
                    ok : 'Ok'
                });
            });
        },

        cancel : function () {
            dialogAdvanced.cancel();
        }
    };

    signUP.functions.core();
}
})();
(function(){
"use strict";
/**
 * Created by guiga on 25/05/2017.
 */

angular.module('home')
    .service('loginService', loginService)
    .factory('authInterceptor', authInterceptor)
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    });

function loginService($window, $resource) {
    return {
        signUP : $resource('web/signUp'),

        doLogin: $resource('web/doLogin'),

        doLogout : function () {
            $window.localStorage.clear();
            $window.location.reload();
        }
    }
}

function authInterceptor($q, $window) {
    return {
        request: function (config) {
            config.headers = config.headers || {};

            if ($window.localStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
            }
            return config;
        },
        response: function (response) {
            if (response.status === 401) {
                console.log('denied');
            }
            return response || $q.when(response);
        }
    };
}
})();
(function(){
"use strict";
angular.module('mainControl', [])
    .controller('mainControlController', mainControl);

function mainControl() {
    var mainControl = this;

    console.log(mainControl);
}
})();
(function(){
"use strict";
angular.module('profile', [])
    .controller('profileController', profile);

function profile(profileGet, profileService, zipCodeSearch, Upload, dialogAlert) {
    var profile = this;
    profile.vars = {};
    profile.vars.charge = true;

    profile.functions = {
        core : function () {
            profile.functions.getProfile.get();
        },

        defineVars : function () {
            profile.vars.hours = [
                '00:00',
                '00:30',
                '01:00',
                '01:30',
                '02:00',
                '02:30',
                '03:00',
                '03:30',
                '04:00',
                '04:30',
                '05:00',
                '05:30',
                '06:00',
                '06:30',
                '07:00',
                '07:30',
                '08:00',
                '08:30',
                '09:00',
                '09:30',
                '10:00',
                '10:30',
                '11:00',
                '11:30',
                '12:00',
                '12:30',
                '13:00',
                '13:30',
                '14:00',
                '14:30',
                '15:00',
                '15:30',
                '16:00',
                '16:30',
                '17:00',
                '17:30',
                '18:00',
                '18:30',
                '19:00',
                '19:30',
                '20:00',
                '20:30',
                '21:00',
                '21:30',
                '22:00',
                '22:30',
                '23:00',
                '23:30'
            ];
            profile.vars.listUF = [
                'SP',
                'AC',
                'AL',
                'AM',
                'AP',
                'BA',
                'CE',
                'DF',
                'ES',
                'GO',
                'MA',
                'MG',
                'MS',
                'MT',
                'PA',
                'PB',
                'PE',
                'PI',
                'PR',
                'RJ',
                'RN',
                'RO',
                'RR',
                'RS',
                'SC',
                'SE',
                'TO'
            ];

            if(profile.vars._id){
                if(profile.vars.sunday.status === false){
                    profile.vars.sundayClosed = true;
                }else{
                    if(profile.vars.sunday.timeStart === profile.vars.sunday.timeEnd){
                        profile.vars.sundayAllDay = true;
                    }

                    profile.vars.sundayStart = profile.vars.sunday.timeStart;
                    profile.vars.sundayEnd = profile.vars.sunday.timeEnd;
                }

                if(profile.vars.monday.status === false){
                    profile.vars.mondayClosed = true;
                }else{
                    if(profile.vars.monday.timeStart === profile.vars.monday.timeEnd){
                        profile.vars.mondayAllDay = true;
                    }

                    profile.vars.mondayStart = profile.vars.monday.timeStart;
                    profile.vars.mondayEnd = profile.vars.monday.timeEnd;
                }

                if(profile.vars.tuesday.status === false){
                    profile.vars.tuesdayClosed = true;
                }else{
                    if(profile.vars.tuesday.timeStart === profile.vars.tuesday.timeEnd){
                        profile.vars.tuesdayAllDay = true;
                    }

                    profile.vars.tuesdayStart = profile.vars.tuesday.timeStart;
                    profile.vars.tuesdayEnd = profile.vars.tuesday.timeEnd;
                }

                if(profile.vars.wednesday.status === false){
                    profile.vars.wednesdayClosed = true;
                }else{
                    if(profile.vars.wednesday.timeStart === profile.vars.wednesday.timeEnd){
                        profile.vars.wednesdayAllDay = true;
                    }

                    profile.vars.wednesdayStart = profile.vars.wednesday.timeStart;
                    profile.vars.wednesdayEnd = profile.vars.wednesday.timeEnd;
                }

                if(profile.vars.thursday.status === false){
                    profile.vars.thursdayClosed = true;
                }else{
                    if(profile.vars.thursday.timeStart === profile.vars.thursday.timeEnd){
                        profile.vars.thursdayAllDay = true;
                    }

                    profile.vars.thursdayStart = profile.vars.thursday.timeStart;
                    profile.vars.thursdayEnd = profile.vars.thursday.timeEnd;
                }

                if(profile.vars.friday.status === false){
                    profile.vars.fridayClosed = true;
                }else{
                    if(profile.vars.friday.timeStart === profile.vars.friday.timeEnd){
                        profile.vars.fridayAllDay = true;
                    }

                    profile.vars.fridayStart = profile.vars.friday.timeStart;
                    profile.vars.fridayEnd = profile.vars.friday.timeEnd;
                }

                if(profile.vars.saturday.status === false){
                    profile.vars.saturdayClosed = true;
                }else{
                    if(profile.vars.saturday.timeStart === profile.vars.saturday.timeEnd){
                        profile.vars.saturdayAllDay = true;
                    }

                    profile.vars.saturdayStart = profile.vars.saturday.timeStart;
                    profile.vars.saturdayEnd = profile.vars.saturday.timeEnd;
                }
            }
        },

        getProfile : {
            get : function () {
                profileService.getProfile.save({id : profileGet.id}, profile.functions.getProfile.success)
            },

            success : function (data) {
                profile.vars.charge = false;
                profile.vars = data.data;

                profile.functions.defineVars();
            }
        },

        zipCodeChange : function () {
            profile.vars.zipCode = profile.vars.zipCode.replace('-', '');
            if(profile.vars.zipCode.length >= 8){
                zipCodeSearch.getDataBack.save(profile.vars, function (data) {
                    profile.vars.address = data.address.logradouro;
                    profile.vars.complement = data.address.complemento;
                    profile.vars.neighborhood = data.address.bairro;
                    profile.vars.city = data.address.localidade;
                    profile.vars.uf = data.address.uf;
                    profile.vars.lat = data.latlong.lat;
                    profile.vars.long = data.latlong.lng;
                });
            }
        },

        upload : function () {
            Upload.upload({
                url: '/web/updateProfile',
                method: 'POST',
                data: {
                    file: profile.vars.files,
                    vars : profile.vars
                }
            }).then(function () {
                dialogAlert.show({
                    title : 'Sucesso!',
                    content : 'Seu perfil foi atualizado com sucesso!',
                    ok : 'OK!'
                });

                profile.functions.getProfile.get();
            });
        }
    };

    profile.functions.core();
}
})();
(function(){
"use strict";
angular.module('profile')
    .service('profileService', profileService);

function profileService($resource) {
    return {
        updateProfile : $resource('web/updateProfile'),
        getProfile : $resource('web/getProfile')
    }
}
})();