/**
 * Created by guiga on 28/05/2017.
 */

angular
    .module('core')
    .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
    }]);