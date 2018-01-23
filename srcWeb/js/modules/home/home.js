angular.module('home', [])
    .controller('homeController', home);

function home(dialogAdvanced) {
    var home = this;

    home.functions = {
        core : function () {},

        doLogin : function () {
            dialogAdvanced.show({
                controller : loginController,
                controllerAs : 'login',
                templateUrl : 'templates/modules/home/loginDialog.html',
                clickOutsideToClose : false
                /*functionThen : function () {}*/
            });
        },

        signUp : function () {
            dialogAdvanced.show({
                controller : signUPController,
                controllerAs : 'signUP',
                templateUrl : 'templates/modules/home/signUPDialog.html',
                clickOutsideToClose : false
                /*functionThen : function () {}*/
            });
        }
    };

    home.functions.core();
}

function loginController($scope, dialogAdvanced, loginService, recoveryPasswordService, dialogAlert, $window) {
    var login = this;
    login.vars = {};

    login.functions = {
        core : function () {},

        loginAction : function () {
            loginService.doLogin.save(login.vars, function (data) {
                console.log(data.status === true);
                switch (true){
                    case data.status === true:
                        login.vars.alert = false;

                        $window.localStorage.token = data.token;
                        $window.location.reload();
                        break;

                    case data.status === false:
                        $scope.loginForm.username.$setValidity('userPassFound', false);
                        $scope.loginForm.password.$setValidity('userPassFound', false);
                        break;

                    default:
                        $scope.loginForm.username.$setValidity('userPassFound', false);
                        $scope.loginForm.password.$setValidity('userPassFound', false);
                }
            });
        },

        recoveryPasswordSend : function () {
            recoveryPasswordService.recoveryPasswordSend.save(login.vars, function (data) {
                switch (true){
                    case data.status === true:
                        login.vars.alert = true;
                        login.vars.message = 'Enviamos um link para recuperação de senha, veja seu e-mail e clique no link para alterá-la.';
                        break;

                    case data.status === false:
                        $scope.loginForm.forgotPass.$setValidity('userFound', false);
                        break;

                    default:
                        $scope.loginForm.forgotPass.$setValidity('userFound', false);
                }
            });
        },

        signUP : function () {
            dialogAdvanced.show({
                controller : signUPController,
                controllerAs : 'signUP',
                templateUrl : 'templates/modules/home/signUPDialog.html',
                clickOutsideToClose : false
                /*functionThen : function () {}*/
            });
        },

        cancel : function () {
            dialogAdvanced.cancel();
        }
    };
}

function signUPController(dialogAdvanced, loginService, zipCodeSearch, $scope, dialogAlert, $window) {
    var signUP = this;
    signUP.vars = {};

    signUP.functions = {
        core : function () {
            signUP.functions.defineVars();
            signUP.functions.watchMatch();
        },

        defineVars : function () {
            signUP.vars.listUF = [
                'SP',
                'AC',
                'AL',
                'AM',
                'AP',
                'BA',
                'CE',
                'DF',
                'ES',
                'GO',
                'MA',
                'MG',
                'MS',
                'MT',
                'PA',
                'PB',
                'PE',
                'PI',
                'PR',
                'RJ',
                'RN',
                'RO',
                'RR',
                'RS',
                'SC',
                'SE',
                'TO'
            ];
        },

        watchMatch : function () {
            $scope.$watchGroup(['signUP.vars.password', 'signUP.vars.repPassword'], function (value) {
                if(value[0] !== value[1]){
                    $scope.adminSignUp.password.$setValidity('notMatch', false);
                    $scope.adminSignUp.repPassword.$setValidity('notMatch', false);
                }else{
                    $scope.adminSignUp.password.$setValidity('notMatch', true);
                    $scope.adminSignUp.repPassword.$setValidity('notMatch', true);
                }
            });
        },

        checkCNPJ : function () {
            if(signUP.vars.cnpj==='00000000000000'){
                $scope.adminSignUp.cnpj.$setValidity('void', false);
            }
        },

        zipCodeChange : function () {
            signUP.vars.zipCode = signUP.vars.zipCode.replace('-', '');
            if(signUP.vars.zipCode.length >= 8){
                zipCodeSearch.getData(signUP.vars).then(function (data) {
                    signUP.vars.address = data.address.logradouro;
                    /*signUP.vars.complement = data.address.complemento;*/
                    signUP.vars.neighborhood = data.address.bairro;
                    signUP.vars.city = data.address.localidade;
                    signUP.vars.uf = data.address.uf;
                    signUP.vars.lat = data.latlong.lat;
                    signUP.vars.long = data.latlong.lng;
                    signUP.vars.status = data.latlong.status;
                });
            }
        },

        signUPAction : function () {
            loginService.signUP.save(signUP.vars, function (data) {
                switch (true){
                    case data.status === true:
                        signUP.vars.message = 'Você foi cadastrado com sucesso!';
                        $window.localStorage.token = data.token;
                        $window.location.reload();
                        break;

                    case data.status === false:
                        signUP.vars.message = 'Alguma coisa deu errado, tente novamente :(!';
                        break;

                    default:
                        signUP.vars.message = 'Alguma coisa deu errado, tente novamente :(!';
                }

                dialogAlert.show({
                    title : 'Atenção',
                    content : signUP.vars.message,
                    ok : 'Ok'
                });
            });
        },

        cancel : function () {
            dialogAdvanced.cancel();
        }
    };

    signUP.functions.core();
}