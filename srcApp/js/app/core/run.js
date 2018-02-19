angular
    .module('core')
    .run(function($rootScope, $window, $state, saveLastAction) {
        $rootScope.$on('$stateChangeStart', function (e, toState) {
            // Set scroll to 0
            window.scrollTo(0, 0);
            var token = $window.localStorage.token;

            if (toState.name === 'login' && token !== undefined) {
                e.preventDefault();

                if($window.localStorage.lastAction){
                    var lastAction = saveLastAction.get().lastAction;
                    switch (true){
                        case lastAction.action === 'initRequest':
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
                }else{
                    $state.go('user.mainList');
                }
            }
        });
    });