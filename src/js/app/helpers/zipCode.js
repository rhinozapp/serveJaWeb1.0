angular
    .module('core')
    .service('getLatLong', function ($http) {
        return {
            getData : function (zipCode) {
                return new Promise((success => {
                    var results;
                    return $http.get('http://maps.google.com/maps/api/geocode/json?address='+zipCode).then(function (response) {
                        if (response.data.status === 'OK') {
                            results = {
                                lat : response.data.results[0].geometry.location.lat,
                                lng : response.data.results[0].geometry.location.lng,
                                status : true
                            };

                            success(results);
                        }else{
                            results = {
                                lat : 0,
                                lng : 0,
                                status : false
                            };

                            success(results);
                        }
                    });
                }));

            }
        };
    })
    .service('getAddress', function ($http) {
        return {
            getData : function (zipCode) {
                return new Promise((success => {
                    $http.get("https://viacep.com.br/ws/"+zipCode+"/json/").then(function (response) {
                        success(response.data);
                    });
                }));
            }
        };
    })
    .service('zipCodeSearch', function (getLatLong, getAddress, $resource) {
        return {
            getData : function (allAddress) {
                return new Promise((success => {
                    var results = {};

                    getLatLong.getData(allAddress.zipCode).then(function (data) {
                        results.latlong = data;

                        getAddress.getData(allAddress.zipCode).then(function (data) {
                            results.address = data;

                            success(results);
                        });
                    });
                }));
            },
            getDataBack : $resource('web/zipCode')
        };
    });