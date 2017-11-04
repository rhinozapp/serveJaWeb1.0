/**
 * Created by guilherme.assis on 2/24/2016.
 * @Description: Configuração das Rotas do RhinozApp Project.
 */

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
                templateUrl: 'templates/modules/mainList/mainList.html',
                controller: 'mainListController',
                controllerAs : 'mainList'
            })
            .state('user.profile', {
                url: '/profile',
                templateUrl: 'templates/modules/profile/profile.html',
                controller: 'profileController',
                controllerAs : 'profile'
            })

            .state('login', {
                url: '/login',
                templateUrl: 'templates/modules/login/login.html',
                controller: 'loginController',
                controllerAs: 'login',
            });

        $locationProvider.html5Mode(false);
    });
