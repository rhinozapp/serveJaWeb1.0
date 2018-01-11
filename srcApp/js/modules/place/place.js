angular.module('place', [])
    .controller('placeController', placeController);

function placeController($stateParams, placeService){
    var place = this;
    place.vars = {};

    place.vars = $stateParams;
}