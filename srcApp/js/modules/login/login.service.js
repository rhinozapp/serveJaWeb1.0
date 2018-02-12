angular.module('login')
    .service('loginService', loginService)
    .factory('authInterceptor', authInterceptor)
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    });

function loginService($window, dialogAlert, $resource, defineHost, $cordovaOauth, $http) {
    return {
        doLoginFacebook: function () {
            return $cordovaOauth.facebook('262613364247603', ['public_profile']).then(function(result) {
                return $http.get('https://graph.facebook.com/v2.11/me', {
                    params: {
                        access_token: result.access_token,
                        fields: 'name,picture,email',
                        format: 'json'
                    }
                }).success(function (data, status, headers, config) {
                    return {
                        dataFacebook : data,
                        token : result.access_token
                    };
                }).error(function (error) {
                    dialogAlert.show({
                        title : 'Atenção!',
                        content : error,
                        ok : 'OK!'
                    });
                });

            }, function(error) {
                dialogAlert.show({
                    title : 'Atenção!',
                    content : error,
                    ok : 'OK!'
                });
            });
        },

        doLoginGoogle : function () {
            return new Promise(function(success, fail){
                window.plugins.googleplus.login(
                    {
                        'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
                        'webClientId': '675857416832-gkkntadhdgbjs8o19akb071ho7stguki.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
                        'offline': true // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
                    },
                    function (obj) {
                        success(JSON.stringify(obj)); // do something useful instead of alerting
                    },
                    function (msg) {
                        fail(msg);
                    }
                );
            });
        },

        doLoginHack : $resource(defineHost.host + '/app/doLoginHack'),

        recordData : $resource(defineHost.host + '/app/doLogin'),

        doLogout : function () {
            $window.localStorage.clear();
            $window.location.reload();
        },
    };
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