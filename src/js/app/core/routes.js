/**
 * Created by guilherme.assis on 2/24/2016.
 * @Description: Configuração das Rotas do RhinozApp Project.
 */

angular
    .module('core')
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise('login');
        $locationProvider.html5Mode(false);

        $stateProvider
            .state('login', {
                url: '/login',
                controller: 'loginController',
                controllerAs : 'login',
                templateUrl: 'templates/modules/login/login.html',
                data: {
                    /*css: 'build/css/login.css'*/
                }
            })
            .state('timeLine', {
                url: '/timeLine',
                controller: 'timeLineController',
                controllerAs : 'timeLine',
                templateUrl: 'templates/modules/timeLine/timeLine.html'
            });

        // use the HTML5 History API
        $locationProvider.html5Mode(false);
    });
