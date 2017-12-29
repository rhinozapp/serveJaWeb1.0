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

                loginService.signUpBack.save({
                    email : email,
                    userIDFirebase : data.uid,
                    type : 'firebaseEmail'
                });

                $window.location.reload();
                //endregion
            }).catch(function(error) {
                console.log(error);
                dialogAlert.show({
                    title : 'Ops!',
                    content : 'Seu cadastro não foi criado! Tente realizar o login.',
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

                    case error.code === 'auth/user-not-found':
                        message = 'Seu usuário não foi encotrado, faça seu cadastro no formulário anterior';
                        break;

                    case error.code === 'auth/argument-error':
                        message = 'Este não é um e-mail válido';
                        break;

                    default:
                        message = 'Algo aconteceu, tente novamente mais tarde'
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
            provider.addScope('user_likes');

            firebase.auth().signInWithPopup(provider).then(function(result) {
                $window.localStorage.userUID = result.credential.accessToken;

                $resource(defineHost.host+'signup').save({
                    userIDFirebase : result.credential.accessToken,
                    profileFacebook : result.additionalUserInfo,
                    type : 'firebaseFacebook'
                }, function () {
                    $window.location.reload();
                }, function (err) {
                    console.log(err);
                    firebase.auth().signOut().then(function() {
                        $window.localStorage.clear();
                        $window.location.reload();
                    }, function() {
                        $window.localStorage.clear();
                        $window.location.reload();
                    });
                });
            }).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...

                console.log(error);

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

        signUpBack : $resource(defineHost.host+'signup')
    }
}