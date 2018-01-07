/**
 * Created by guiga on 04/02/2017.
 */

angular.module('mainList', [])
    .controller('mainListController', mainListController);

function mainListController(loginService, getCoordinates, $window, mainListService) {
    var mainList = this;

    /*getCoordinates.getCurrentPosition(function (data) {
        console.log(data)
    });*/

    mainList.vars = {};

    mainList.functions = {
        core : function () {
            mainList.functions.getCoordinates();
            mainList.functions.getList.get();
        },

        getCoordinates : function () {
            if(!$window.localStorage.lat){
                getCoordinates.getPos();
            }
        },

        getList : {
            get : function () {
                mainListService.get.save({
                    lat : $window.localStorage.lat,
                    long : $window.localStorage.long
                }, mainList.functions.getList.success)
            },

            success : function (data) {
                console.log(data);
            }
        },

        logout : function () {
            loginService.doLogout();
        }
    };

    mainList.functions.core();
}
