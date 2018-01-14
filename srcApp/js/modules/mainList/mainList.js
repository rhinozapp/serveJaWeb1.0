angular.module('mainList', [])
    .controller('mainListController', mainListController);

function mainListController(loginService, getCoordinates, mainListService, haversine, $scope, $filter, $stateParams, getProfile) {
    var mainList = this;
    mainList.vars = {};

    console.log(moment().get('hour'));

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
                mainList.vars.nearLocal = 'seu local.';
                mainListService.get.save({
                    lat : mainList.vars.lat,
                    long : mainList.vars.long
                }, mainList.functions.getList.success);
            },

            getLocal : function () {
                if(typeof mainList.vars.searchLocal === "object"){
                    mainList.vars.nearLocal = mainList.vars.searchLocal.formatted_address;
                    mainList.vars.search = '';
                    mainListService.get.save({
                        lat : mainList.vars.searchLocal.geometry.location.lat(),
                        long : mainList.vars.searchLocal.geometry.location.lng()
                    }, mainList.functions.getList.success);
                }
            },

            getFavorite : function () {},

            success : function (data) {
                mainList.vars.list = data.data;

                if(mainList.vars.lat){
                    mainList.vars.latSearch = mainList.vars.lat;
                    mainList.vars.longSearch = mainList.vars.long;
                }else{
                    mainList.vars.latSearch = mainList.vars.searchLocal.geometry.location.lat();
                    mainList.vars.longSearch = mainList.vars.searchLocal.geometry.location.lng();
                }

                angular.forEach(mainList.vars.list, function (value) {
                    //region Distance
                    value.distance = haversine({
                        latitude : mainList.vars.latSearch,
                        longitude : mainList.vars.longSearch
                    }, {
                        latitude : value.loc.coordinates[1],
                        longitude : value.loc.coordinates[0]
                    }, {unit: 'km'});
                    //endregion

                    //region Define open or close pub
                    switch (true){
                        case moment().weekday() === 0:
                            if(value.sunday.status){
                                if(value.sunday.timeStart === value.sunday.timeEnd){
                                    value.openToday = true;
                                    value.openAllDay = true;
                                    value.timeStart = value.sunday.timeStart;
                                    value.timeEnd = value.sunday.timeEnd;
                                }else{

                                    if(moment().isBetween(moment(value.sunday.timeStart, "HH:mm") , moment(value.sunday.timeEnd, "HH:mm a"))){
                                        value.openToday = true;
                                        value.openAllDay = false;
                                        value.timeStart = value.sunday.timeStart;
                                        value.timeEnd = value.sunday.timeEnd;
                                    }else{
                                        value.openToday = false;
                                    }
                                }
                            }else{
                                value.openToday = false;
                            }
                            break;

                        case moment().weekday() === 1:
                            break;

                        case moment().weekday() === 2:
                            break;

                        case moment().weekday() === 3:
                            break;

                        case moment().weekday() === 4:
                            break;

                        case moment().weekday() === 5:
                            break;

                        case moment().weekday() === 6:
                            break;

                        default:
                    }
                    //endregion
                });

                mainList.vars.listFilter = mainList.vars.list;
            },
        },

        logout : function () {
            loginService.doLogout();
        }
    };

    mainList.functions.core();
}
