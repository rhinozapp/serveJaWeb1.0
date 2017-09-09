(function(){
"use strict";
angular.module('modules', [
  'login',
  'timeLine'
]);

})();
(function(){
"use strict";
/**
 * Created by guiga on 04/02/2017.
 */

angular.module('login', [])
    .controller('loginController', login);

function login(loginService) {
    var login = this;
    login.vars = {};

    login.functions = {
        core : function () {},

        loginEmail : function () {
            /*loginService.doLoginEmail(login.vars.email, login.vars.password);*/
            loginService.test.save({test : true});
        },

        resetPassword : function () {
            loginService.resetPassword(login.vars.email);
        },

        loginFacebook : function () {
            loginService.doLoginFacebook();
        },

        signUp : function () {
            loginService.signUp(login.vars.email, login.vars.password);
        }
    };

    login.functions.core();
}

})();
(function(){
"use strict";
/**
 * Created by guiga on 01/09/2017.
 */

angular.module('login')
    .service('loginService', loginService);

function loginService($window, dialogAlert, $resource, defineHost) {
    return {
        signUp : function (email, password) {
            firebase.auth().createUserWithEmailAndPassword(email, password).then(function (data) {
                //region Reload
                $window.localStorage.userUID = data.uid;
                $window.location.reload();
                //endregion
            }).catch(function(error) {
                console.log(error);
                dialogAlert.show({
                    title : 'Ops!',
                    content : 'Seu cadastro não foi criado! Tente novamente mais tarde.',
                    ok : 'OK!'
                });
            });
        },

        doLoginEmail: function (email, password) {
            firebase.auth().signInWithEmailAndPassword(email, password).then(function (data) {
                $window.localStorage.userUID = data.uid;
                $window.location.reload();

            }).catch(function(error) {

                var message = '';
                switch (true){
                    case error.code === 'auth/invalid-email':
                        message = 'E-mail inválido, crie uma conta para utilizar o Rhinoz';
                        break;

                    case error.code === 'auth/wrong-password':
                        message = 'Senha inválido, entre com uma senha válida para utiizar o Rhinoz';
                        break;
                }

                dialogAlert.show({
                    title : 'Atenção!',
                    content : message,
                    ok : 'OK!'
                });
            });
        },

        doLoginFacebook: function () {
            var provider = new firebase.auth.FacebookAuthProvider();
            provider.addScope('public_profile');
            provider.addScope('email');

            firebase.auth().signInWithPopup(provider).then(function(result) {
                console.log(result);

                $window.localStorage.userUID = result.credential.accessToken;
                $window.location.reload();
            }).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...

                dialogAlert.show({
                    title : 'Atenção!',
                    content : error.message,
                    ok : 'OK!'
                });
            });
        },

        doLogout : function () {
            firebase.auth().signOut().then(function() {
                $window.localStorage.clear();
                $window.location.reload();
            }, function() {
                $window.localStorage.clear();
                $window.location.reload();
            });
        },
        
        resetPassword : function (email) {
            firebase.auth().sendPasswordResetEmail(email).then(function() {
                dialogAlert.show({
                    title : 'Atenção!',
                    content : 'Email enviado',
                    ok : 'OK!'
                });
            }, function(error) {
                dialogAlert.show({
                    title : 'Atenção!',
                    content : 'Email não enviado',
                    ok : 'OK!'
                });
            });
        },

        test : $resource(defineHost.host+'login')
    }
}
})();
(function(){
"use strict";
/**
 * Created by guiga on 04/02/2017.
 */

angular.module('timeLine', [])
    .controller('timeLineController', timeLine);

function timeLine(loginService) {
    var timeLine = this;
    timeLine.vars = {};

    timeLine.functions = {
        core : function () {},

        logout : function () {
            loginService.doLogout();
        }
    };

    timeLine.functions.core();
}

})();