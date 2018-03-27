angular
    .module('core')
    .config(function ($mdThemingProvider) {

        $mdThemingProvider.definePalette('myTheme', $mdThemingProvider.extendPalette('amber', {
            '500': '#ffbb00'
        }));

        $mdThemingProvider.theme('default')
            .primaryPalette('myTheme')
            .accentPalette('grey')
            .warnPalette('orange');
    });