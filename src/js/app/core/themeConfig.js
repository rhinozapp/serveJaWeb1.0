/**
 * Created by guiga on 25/05/2017.
 */

angular
    .module('core')
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('yellow', {
                'default' : '400'
            })
            .accentPalette('blue-grey', {
                'default' : '400'
            })
            .warnPalette('orange');

        $mdThemingProvider.enableBrowserColor({
            hue: '200' // Default is '800'
        });
    });