exports.zipCode = function (req, res) {
    let request = require('request'),
        functions,
        results = {},
        zipCode = req.body.zipCode.replace('-', ''),
        bodyResult = {};


    functions = {
        zipCodeSearch : function () {
            return new Promise((success => {
                functions.getLatLong(zipCode).then(function (data) {
                    results.latlong = data;

                    functions.getAddress(zipCode).then(function (data) {
                        results.address = data;

                        success(results);
                    });
                });
            }));
        },

        getAddress : function (zipCode){
            return new Promise((success => {
                request({
                    method: 'GET',
                    url: 'https://viacep.com.br/ws/'+zipCode+'/json/',
                }, function (error, response, body) {
                    if (error){
                        success(error);
                    }else{
                        success(JSON.parse(body));
                    }
                });
            }));
        },

        getLatLong : function (zipCode){
            return new Promise((success => {
                let results;
                return request({
                    method: 'GET',
                    url: 'http://maps.google.com/maps/api/geocode/json?address='+zipCode,
                }, function (error, response, body) {
                    if (error){
                        results = {
                            status : false
                        };

                        success(results);
                    }else{
                        bodyResult = JSON.parse(body);

                        if(bodyResult.status === 'OK'){
                            results = {
                                lat : bodyResult.results[0].geometry.location.lat,
                                lng : bodyResult.results[0].geometry.location.lng,
                                status : true
                            };
                        }else{
                            results = {
                                lat : 0,
                                lng : 0,
                                status : false
                            };
                        }

                        success(results);
                    }
                });
            }));
        },
    };

    functions.zipCodeSearch().then(function (data) {
        res.json(data);
    });
};