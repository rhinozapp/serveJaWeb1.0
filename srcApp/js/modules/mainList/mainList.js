angular.module('mainList', [])
    .controller('mainListController', mainListController);

function mainListController(loginService, getCoordinates, mainListService, haversine, $scope, $filter, $stateParams, getProfile) {
    var mainList = this;
    mainList.vars = {};

    mainList.functions = {
        core : function () {
            mainList.functions.defineVars();
            mainList.functions.checkParams();
            mainList.functions.search();
        },

        defineVars : function () {
            mainList.vars.profile = getProfile;
        },

        checkParams : function () {
            if($stateParams.action.length === 0 || $stateParams.action === 'nearToMe'){
                getCoordinates.getPos().then(function (data) {
                    mainList.vars.lat = data.lat;
                    mainList.vars.long = data.long;

                    mainList.functions.getList.getNear();
                });
            }else if($stateParams.action === 'favorites'){
                mainList.functions.getList.getFavorite();

            }else if($stateParams.action === 'findLocal'){
                mainList.vars.actionFindLocal = true;
            }
        },

        search : function () {
            $scope.$watch('mainList.vars.search', function (newvalue, oldvalue) {
                if(newvalue < oldvalue){
                    mainList.vars.listFilter = mainList.vars.list
                }else{
                    mainList.vars.listFilter = $filter('filter')(mainList.vars.list, {
                        name : newvalue
                    });
                }
            });
        },

        getList : {
            getNear : function () {
                mainListService.get.save({
                    lat : mainList.vars.lat,
                    long : mainList.vars.long
                }, mainList.functions.getList.success)
            },

            getFavorite : function () {},

            success : function (data) {
                mainList.vars.list = data.data;
                angular.forEach(mainList.vars.list, function (value) {
                    value.distance = haversine({
                        latitude : mainList.vars.lat,
                        longitude : mainList.vars.long
                    }, {
                        latitude : value.loc.coordinates[1],
                        longitude : value.loc.coordinates[0]
                    }, {unit: 'km'});
                });

                mainList.vars.listFilter = mainList.vars.list;
            }
        },

        logout : function () {
            loginService.doLogout();
        }
    };

    mainList.functions.core();
}
