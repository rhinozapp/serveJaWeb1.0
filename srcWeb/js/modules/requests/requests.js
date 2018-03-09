angular.module('requests', [])
    .controller('requestsController', requests);

function requests($scope, $filter, profileGet, requestsService, dialogAdvanced, dialogAlert, dialogConfirm) {
    var requests = this;
    requests.vars = {};

    requests.functions = {
        core: function () {
            requests.functions.getRequests.getRequests();
        },

        defineVars : function () {},

        getRequests : {
            getRequests : function () {
                requestsService.getRequests.save(profileGet, requests.functions.getRequests.successGetRequests)
            },

            successGetRequests : function (data) {
                socket.on(profileGet.id, function (data) {
                    console.log(data);
                });
            }
        }
    };

    requests.functions.core();
}