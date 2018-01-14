angular.module('place', [])
    .controller('placeController', placeController);

function placeController($stateParams, $state, placeService){
    var place = this;
    place.vars = {};

    place.functions = {
        core : function () {
            place.functions.defineVars();
        },

        defineVars : function () {
            if($stateParams.place._id){
                place.vars.dataPub = $stateParams;
            }else{
                $state.go('user.mainList');
            }
        }
    };

    place.functions.core();
}