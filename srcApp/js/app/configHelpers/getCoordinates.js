angular
    .module('core')
    .service('getCoordinates', function () {
        return {
            getPos : function () {
                return new Promise(function (success) {
                    if(window.navigator && window.navigator.geolocation){
                        window.navigator.geolocation.getCurrentPosition(function (data) {
                            success({
                                lat : data.coords.latitude,
                                long : data.coords.longitude
                            });
                        }, function () {
                            success({
                                lat : '-23.533773',
                                long : '-46.625290'
                            });
                        }, {
                            enableHighAccuracy: true,
                            maximumAge: 0
                        });
                    }else{
                        success({
                            lat : '-23.533773',
                            long : '-46.625290'
                        });
                    }
                });
            }
        }
    });