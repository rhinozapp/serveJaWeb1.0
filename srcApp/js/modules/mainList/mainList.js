/**
 * Created by guiga on 04/02/2017.
 */

angular.module('mainList', [])
    .controller('mainListController', mainListController);

function mainListController(loginService, getCoordinates, $window, mainListService, haversine, $scope, $filter) {
    var mainList = this;
    mainList.vars = {};

    mainList.functions = {
        core : function () {
            mainList.functions.getCoordinates();
            mainList.functions.getList.get();
            mainList.functions.search();
        },

        getCoordinates : function () {
            if(!$window.localStorage.lat){
                getCoordinates.getPos();
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
            get : function () {
                mainListService.get.save({
                    lat : $window.localStorage.lat,
                    long : $window.localStorage.long
                }, mainList.functions.getList.success)
            },

            success : function (data) {
                mainList.vars.list = data.data;
                angular.forEach(mainList.vars.list, function (value) {
                    value.distance = haversine({
                        latitude : $window.localStorage.lat,
                        longitude : $window.localStorage.long
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
