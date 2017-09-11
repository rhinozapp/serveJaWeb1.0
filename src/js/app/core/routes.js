/**
 * Created by guilherme.assis on 2/24/2016.
 * @Description: Configuração das Rotas do RhinozApp Project.
 */

angular
    .module('core')
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider, stateHelperProvider) {
        $urlRouterProvider.otherwise('login');
        $locationProvider.html5Mode(false);

        stateHelperProvider
            .state({
                name: 'login',
                url: '/login',
                controller: 'loginController',
                controllerAs: 'login',
                templateUrl: 'templates/modules/login/login.html',
                /*data: {
                    css: 'build/css/login.css'
                },
                children: []*/
            })

            .state({
                name: 'user',
                url: '/user',
                abstract: true,
                templateUrl: "templates/app/layout/layout.html",
                children: [
                    {
                        name: 'mainList',
                        url: '/mainList',
                        controller: 'mainListController',
                        controllerAs : 'mainList',
                        templateUrl: 'templates/modules/mainList/mainList.html'
                    },

                    {
                        name: 'profile',
                        url: '/profile',
                        controller: 'profileController',
                        controllerAs : 'profile',
                        templateUrl: 'templates/modules/profile/profile.html'
                    }
                ]
            });

        // use the HTML5 History API
        $locationProvider.html5Mode(false);
    });
