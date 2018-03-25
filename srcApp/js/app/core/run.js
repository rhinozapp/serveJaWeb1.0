angular
    .module('core')
    .run(function($rootScope, $window, $state, saveLastAction, getRequestStatus, getProfile) {
        $rootScope.$on('$stateChangeStart', function (e, toState) {
            // Set scroll to 0
            window.scrollTo(0, 0);
            var token = $window.localStorage.token;

            //region Check QRCode
            /*if(toState.name !== 'QRCodeReader'){
                QRScanner.prepare(function (err, status) {
                    if(status.scanning){
                        QRScanner.cancelScan();
                        QRScanner.hide();
                    }
                });
            }*/
            //endregion

            //region Check Last Action
            if (toState.name === 'login' && token !== undefined) {
                e.preventDefault();

                if($window.localStorage.lastAction){
                    var lastAction = saveLastAction.get().lastAction;
                    switch (true){
                        case lastAction.action === 'inRequest':
                            if(getProfile.status){
                                getRequestStatus.checkRequestStatus.save({
                                    userAppID : getProfile.id
                                }, function (data) {
                                    if(data.status){
                                        $state.go('placeRequest', {
                                            place : data.place,
                                            tableID : data.tableID,
                                            requestID : data.requestID
                                        });
                                    }
                                })
                            }
                            break;

                        case lastAction.action === 'initRequest':
                            if(getProfile.status){
                                getRequestStatus.checkRequestStatus.save({
                                    userAppID : getProfile.id
                                }, function (data) {
                                    if(data.status){
                                        $state.go('placeRequest', {
                                            place : data.place
                                        });
                                    }else{
                                        $state.go('QRCodeReader', {
                                            place : {
                                                pubData : lastAction.data.pubData,
                                                userLocal : {
                                                    lat : lastAction.data.userLocal.lat,
                                                    long : lastAction.data.userLocal.long
                                                }
                                            }
                                        });
                                    }
                                })
                            }else{
                                $state.go('QRCodeReader', {
                                    place : {
                                        pubData : lastAction.data.pubData,
                                        userLocal : {
                                            lat : lastAction.data.userLocal.lat,
                                            long : lastAction.data.userLocal.long
                                        }
                                    }
                                });
                            }
                            break;
                    }
                }else{
                    $state.go('user.mainList');
                }
            }
            //endregion

            //region Get Request Status
            if(getProfile.status){
                getRequestStatus.checkRequestStatus.save({
                    userAppID : getProfile.id
                }, function (data) {
                    if(data.status){
                        $state.go('placeRequest', {
                            place : data.place,
                            tableID : data.tableID,
                            requestID : data.requestID
                        });
                    }
                })
            }
            //endregion
        });
    });