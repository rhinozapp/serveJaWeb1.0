angular.module('place', [])
    .controller('placeController', placeController);

function placeController($stateParams, $state, placeService, externalLink){
    var place = this;
    place.vars = {};

    place.functions = {
        core : function () {
            place.functions.defineVars();
        },

        defineVars : function () {
            place.vars.showHowToArrive = false;
            if($stateParams.place.pubData){
                place.vars.dataPub = $stateParams.place.pubData;
                place.vars.userLat = $stateParams.place.userLocal.lat;
                place.vars.userLong = $stateParams.place.userLocal.long;
            }else{
                $state.go('user.mainList');
            }
        },

        externalLink : function (url, target, location) {
            externalLink.open({
                url : url,
                target : target,
                location : location
            });
        }
    };

    place.functions.core();
}