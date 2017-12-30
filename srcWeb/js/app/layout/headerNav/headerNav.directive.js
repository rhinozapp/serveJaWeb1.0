/**
 * Created by guiga on 25/05/2017.
 */

angular
    .module('layout')
    .directive('headerNav', headerNav);

function headerNav() {
    return {
        restrict: 'E',
        templateUrl: 'templates/app/layout/headerNav/headerNav.html',
        link: linkFunc,
        controller: 'headerNavController',
        controllerAs: 'headerNav',
        bindToController: true
    };

    function linkFunc(scope, el, attr, ctrl) {}
}