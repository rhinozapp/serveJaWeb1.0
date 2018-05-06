angular.module('recoveryPassword', [])
    .controller('recoveryPasswordController', recoveryPassword);

function recoveryPassword($scope, recoveryPasswordService, dialogAlert, $stateParams, $state) {
    var recoveryPassword = this;
    recoveryPassword.vars = {};

    if(!$stateParams.q){
        $state.go('home');
    }else{
        recoveryPassword.functions = {
            core : function () {
                recoveryPassword.functions.defineVars();
                recoveryPassword.functions.watchMatch();
                recoveryPassword.functions.getHash.get();
            },

            defineVars : function () {
                recoveryPassword.vars.hashRecovery = $stateParams.q;
            },

            watchMatch : function () {
                $scope.$watchGroup(['recoveryPassword.vars.password', 'recoveryPassword.vars.repPassword'], function (value) {
                    if(value[0] !== value[1]){
                        $scope.formReset.password.$setValidity('notMatch', false);
                        $scope.formReset.repPassword.$setValidity('notMatch', false);
                    }else{
                        $scope.formReset.password.$setValidity('notMatch', true);
                        $scope.formReset.repPassword.$setValidity('notMatch', true);
                    }
                });
            },

            getHash : {
                get : function () {
                    recoveryPasswordService.recoveryPasswordGetHash.save(recoveryPassword.vars, recoveryPassword.functions.getHash.getSuccess);
                },

                getSuccess : function (data) {
                    switch (true){
                        case data.status === true:
                            recoveryPassword.vars.alert = false;
                            break;

                        case data.status === false:
                            recoveryPassword.vars.alert = true;
                            break;

                        default:
                            recoveryPassword.vars.alert = true;
                    }

                    if(recoveryPassword.vars.alert){
                        dialogAlert.show({
                            title : 'Atenção',
                            content : 'Você já atualizou sua senha, faça o login ou clique em "Esqueci minha senha"',
                            ok : 'Ok'
                        });

                        $state.go('home');
                    }
                }
            },

            resetPassword : {
                action : function () {
                    recoveryPasswordService.recoveryPassword.save(recoveryPassword.vars, recoveryPassword.functions.resetPassword.recoverySuccess);
                },

                recoverySuccess : function (data) {
                    switch (true){
                        case data.status === true:
                            recoveryPassword.vars.alert = true;
                            recoveryPassword.vars.alertError = false;
                            break;

                        case data.status === false:
                            recoveryPassword.vars.alert = false;
                            recoveryPassword.vars.alertError = true;
                            break;

                        default:
                            recoveryPassword.vars.alert = false;
                            recoveryPassword.vars.alertError = true;
                    }

                    if(recoveryPassword.vars.alertError){
                        dialogAlert.show({
                            title : 'Atenção',
                            content : 'Sua senha não foi atualizada, tente novamente"',
                            ok : 'Ok'
                        });
                    }else if(recoveryPassword.vars.alert){
                        dialogAlert.show({
                            title : 'Atenção',
                            content : 'Sua senha foi atualizada com sucesso! Faça o login com a nova senha"',
                            ok : 'Ok'
                        });

                        $state.go('home');
                    }
                }
            }
        };

        recoveryPassword.functions.core();
    }
}