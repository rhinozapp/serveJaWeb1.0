self.addEventListener('activate', function (event) {});

self.addEventListener('fetch', function (event) {});

self.addEventListener('push', function (event) {});

/*
self.addEventListener('DOMContentLoaded', function() {
    // TODO: Implement getParameterByName()

    var mode = getParameterByName('mode'),
        actionCode = getParameterByName('oobCode'),
        apiKey = getParameterByName('apiKey');

    // Configure the Firebase SDK.
    // This is the minimum configuration required for the API to be used.
    var config = {
        apiKey: apiKey  // This key could also be copied from the web
        // initialization snippet found in the Firebase console.
    };
    var app = firebase.initializeApp(config);
    var auth = app.auth();

    // Handle the user management action.
    switch (mode) {
        case 'resetPassword':
            // Display reset password handler and UI.
            handleResetPassword(auth, actionCode);
            break;
        case 'recoverEmail':
            // Display email recovery handler and UI.
            handleRecoverEmail(auth, actionCode);
            break;
        case 'verifyEmail':
            // Display email verification handler and UI.
            handleVerifyEmail(auth, actionCode);
            break;
        default:
        // Error: invalid mode.
    }
}, false);

function handleResetPassword(auth, actionCode) {
    var accountEmail;
    // Verify the password reset code is valid.
    auth.verifyPasswordResetCode(actionCode).then(function(email) {
        var accountEmail = email;

        // TODO: Show the reset screen with the user's email and ask the user for
        // the new password.

        // Save the new password.
        auth.confirmPasswordReset(actionCode, newPassword).then(function(resp) {
            // Password reset has been confirmed and new password updated.

            // TODO: Display a link back to the app, or sign-in the user directly
            // if the page belongs to the same domain as the app:
            // auth.signInWithEmailAndPassword(accountEmail, newPassword);
        }).catch(function(error) {
            // Error occurred during confirmation. The code might have expired or the
            // password is too weak.
        });
    }).catch(function(error) {
        // Invalid or expired action code. Ask user to try to reset the password
        // again.
    });
}*/
