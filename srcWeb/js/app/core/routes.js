/**
 * Created by guiga on 13/05/2017.
 */
angular
    .module('core')
	.config(function ($stateProvider, $urlRouterProvider, $locationProvider, stateHelperProvider) {
        //region URLPROVIDER
        $urlRouterProvider.otherwise('/home');

        $urlRouterProvider.when('/admin', '/admin/profile');
        $urlRouterProvider.when('/home', '/');
        //endregion

        stateHelperProvider
            .state({
                name: 'home',
                url: '/',
                controller: 'homeController',
                controllerAs: 'home',
                templateUrl: 'templates/modules/home/home.html'
                /*data: {
                    css: 'build/css/home.css'
                },
                children: []*/
            })
			.state({
                name: 'admin',
                url: '/admin',
                abstract: true,
                templateUrl: "templates/app/layout/layout.html",
                children: [
                    //region Main Control
                    {
                        name: 'mainControl',
                        url: '/mainControl',
                        controller: 'mainControlController',
                        controllerAs: 'mainControl',
                        templateUrl: 'templates/modules/mainControl/mainControl.html'
                    },
                    //endregion

                    //region Profile
                    {
                        name: 'profile',
                        url: '/profile',
                        controller: 'profileController',
                        controllerAs: 'profile',
                        templateUrl: 'templates/modules/profile/profile.html'
                    },
                    //endregion
                ]
			});

        /*$locationProvider.html5Mode(true);*/
	});