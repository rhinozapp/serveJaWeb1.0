angular.module('QRCodeReader', [])
    .controller('QRCodeReaderController', QRCodeReaderController);

function QRCodeReaderController($stateParams, $state, getProfile, toastAction, saveLastAction, QRCodeReaderService) {
    var QRCodeReader = this;
    QRCodeReader.vars = {};

    QRCodeReader.functions = {
        core : function () {
            QRCodeReader.functions.initScan();
        },

        initScan : function () {
            if(getProfile.status){
                QRScanner.scan(function (err, tableID){
                    if(err){
                        toastAction.show({
                            top : false,
                            bottom : true,
                            left : false,
                            right : true,
                            text : 'Scan finalizado.',
                            scope : QRCodeReader
                        });
                        QRScanner.cancelScan();
                        QRScanner.hide();
                    } else {
                        QRCodeReader.functions.checkValidTable.checkValidTable(tableID);
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

        checkValidTable : {
            checkValidTable : function (tableID) {
                QRCodeReader.vars.tableID = tableID;
                QRCodeReaderService.checkTableValid.save({
                    place : $stateParams.place,
                    tableID : QRCodeReader.vars.tableID
                }, QRCodeReader.functions.checkValidTable.successCheckValidTable);
            },

            successCheckValidTable : function (data) {
                if(data.status){
                    QRCodeReader.functions.checkValidTable.startRequest();
                }else{
                    toastAction.show({
                        top : false,
                        bottom : true,
                        left : false,
                        right : true,
                        text : 'Essa mesa nao pertence a este bar, tente novamente',
                        scope : QRCodeReader
                    });

                    QRCodeReader.functions.initScan();
                }
            },

            startRequest : function () {
                QRCodeReaderService.startRequest.save({
                    place : $stateParams.place,
                    tableID : QRCodeReader.vars.tableID,
                    userAppID: getProfile.id
                }, QRCodeReader.functions.checkValidTable.successStartRequest)
            },

            successStartRequest : function (data) {
                QRScanner.cancelScan();
                QRScanner.hide();

                if(data.status){
                    toastAction.show({
                        top : false,
                        bottom : true,
                        left : false,
                        right : true,
                        text : 'Seu pedido começou! Escolha os produtos e aproveite!',
                        scope : QRCodeReader
                    });
                    saveLastAction.save({
                        module : 'placeRequest',
                        data : $stateParams.place,
                        action : 'inRequest'
                    });
                    $state.go('placeRequest', {
                        place : $stateParams.place
                    });

                }else{
                    toastAction.show({
                        top : false,
                        bottom : true,
                        left : false,
                        right : true,
                        text : 'Algo deu errado, tente novamente',
                        scope : QRCodeReader
                    });

                    QRCodeReader.functions.initScan();
                }
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