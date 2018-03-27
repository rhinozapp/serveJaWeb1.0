angular
    .module('core')
    .service('getCoordinates', function () {
        return {
            getPos : function () {
                return new Promise(function (success) {
                    if(navigator && navigator.geolocation){
                        navigator.geolocation.getCurrentPosition(function (data) {
                            success({
                                lat : data.coords.latitude,
                                long : data.coords.longitude
                            });
                        }, function () {
                            success({
                                lat : '-23.3251',
                                long : '-46.3810'
                            });
                        }, {
                            maximumAge: 300,
                            timeout:1000,
                            enableHighAccuracy: true
                        });
                    }else{
                        success({
                            lat : '-23.3251',
                            long : '-46.3810'
                        });
                    }
                });
            }
        }
    });