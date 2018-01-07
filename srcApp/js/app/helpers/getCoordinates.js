angular
    .module('core')
    .service('getCoordinates', function ($window) {
        return {
            getPos : function () {
                if(window.navigator && window.navigator.geolocation){
                    window.navigator.geolocation.getCurrentPosition(function (data) {
                        $window.localStorage.lat = data.coords.latitude;
                        $window.localStorage.long = data.coords.longitude;
                    }, function () {
                        $window.localStorage.lat = '-23.533773';
                        $window.localStorage.long = '-46.625290';
                    });
                }else{
                    $window.localStorage.lat = '-23.533773';
                    $window.localStorage.long = '-46.625290';
                }
            }
        }
    });