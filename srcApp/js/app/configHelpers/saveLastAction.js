angular
    .module('core')
    .service('saveLastAction', function ($window) {
        return {
            save: function(obj) {
                $window.localStorage.lastAction = JSON.stringify(obj);
            },

            get : function () {
                var lastAction = {};
                if($window.localStorage.lastAction){
                    lastAction = JSON.parse($window.localStorage.lastAction);
                }else{
                    lastAction = {};
                }

                return {
                    lastAction : lastAction
                };
            }
        };
    });