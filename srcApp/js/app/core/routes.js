angular
    .module('core')
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider, stateHelperProvider) {
        $urlRouterProvider.otherwise('/user/mainList');

        $stateProvider
            .state('user', {
                url: '/user',
                abstract: true,
                templateUrl: "templates/app/layout/layout.html",
            })
            .state('user.mainList', {
                url: '/mainList',
                params : {
                    action : ''
                },
                templateUrl: 'templates/modules/mainList/mainList.html',
                controller: 'mainListController',
                controllerAs : 'mainList'
            })

            .state('place', {
                url: '/place',
                params : {
                    idPlace : {}
                },
                templateUrl: 'templates/modules/place/place.html',
                controller: 'placeController',
                controllerAs: 'place',
            })

            .state('login', {
                url: '/login',
                templateUrl: 'templates/modules/login/login.html',
                controller: 'loginController',
                controllerAs: 'login',
            });

        $locationProvider.html5Mode(false);
    });
