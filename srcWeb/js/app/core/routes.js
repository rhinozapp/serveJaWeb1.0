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
                templateUrl: 'templates/modules/home/home.html',
                /*data: {
                    css: 'build/css/home.css'
                },
                children: []*/
            })
            .state({
                name : 'recoveryPassword',
                url: '/recoveryPassword/:q',
                controller: 'recoveryPasswordController',
                controllerAs : 'recoveryPassword',
                templateUrl: 'templates/modules/recoveryPassword/recoveryPassword.html'
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

                    //region Profile
                    {
                        name: 'products',
                        url: '/products',
                        controller: 'productsController',
                        controllerAs: 'products',
                        templateUrl: 'templates/modules/products/products.html'
                    },
                    //endregion

                    //region Menu
                    {
                        name: 'menu',
                        url: '/menu',
                        controller: 'menuController',
                        controllerAs: 'menu',
                        templateUrl: 'templates/modules/menu/menu.html'
                    },
                    //endregion

                    //region Menu
                    {
                        name: 'tables',
                        url: '/tables',
                        controller: 'tablesController',
                        controllerAs: 'tables',
                        templateUrl: 'templates/modules/tables/tables.html'
                    },
                    //endregion
                ]
			});

        /*$locationProvider.html5Mode(true);*/
	});