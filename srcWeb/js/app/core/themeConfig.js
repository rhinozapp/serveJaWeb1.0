/**
 * Created by guiga on 25/05/2017.
 */

angular
    .module('core')
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('grey', {
                'default' : '800'
            })
            .accentPalette('blue')
            .warnPalette('orange');
    });