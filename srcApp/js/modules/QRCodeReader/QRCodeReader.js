angular.module('QRCodeReader', [])
    .controller('QRCodeReaderController', QRCodeReaderController);

function QRCodeReaderController($stateParams, $state, getProfile, toastAction, saveLastAction) {
    var QRCodeReader = this;
    QRCodeReader.vars = {};

    QRCodeReader.functions = {
        core : function () {
            QRCodeReader.functions.initScan();
        },

        initScan : function () {
            if(getProfile.status){
                QRScanner.scan(function (err, text){
                    if(err){
                        console.log(err);
                    } else {
                        console.log(text);
                        QRScanner.hide();
                        $state.go('user.mainList');
                    }
                });

                QRScanner.show(function(status){});
            }else{
                toastAction.show({
                    top : false,
                    bottom : true,
                    left : false,
                    right : true,
                    text : 'É necessário realizar o login antes de iniciar o pedido',
                    scope : QRCodeReader
                });
                saveLastAction.save({
                    module : 'placeRequest',
                    data : $stateParams.place,
                    action : 'initRequest'
                });
                $state.go('login');
            }
        },

        cancelScan : function () {
            QRScanner.cancelScan();
            QRScanner.hide();
            $state.go('user.mainList');
        }
    };

    QRCodeReader.functions.core();
}