/**
 * Created by guilherme.assis on 02/12/2016.
 */
angular
    .module('core')
    .service('dialogAlert', function ($mdDialog) {
        return {
            show: function(option){
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .clickOutsideToClose(true)
                        .title(option.title)
                        .textContent(option.content)
                        .ariaLabel('dialog')
                        .ok(option.ok)
                )
            }
        };
    })
    .service('dialogAdvanced', function ($mdMedia, $mdDialog) {
        return {
            show : function (options) {
                var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
                $mdDialog.show({
                    controller: options.controller,
                    controllerAs: options.controllerAs,
                    templateUrl: options.templateUrl,
                    parent: angular.element(document.body),
                    clickOutsideToClose:options.clickOutsideToClose,
                    fullscreen: useFullScreen,
                    locals : {
                        data : options.dataToDialog
                    }
                }).then(options.functionThen);
            },

            cancel : function () {
                $mdDialog.cancel();
            },

            hide : function (result) {
                $mdDialog.hide(result);
            }
        }
    })
    .service('dialogConfirm', function ($mdDialog) {
        return {
            show : function (options) {
                var confirm = $mdDialog.confirm()
                    .title(options.title)
                    .textContent(options.textContent)
                    .ariaLabel('confirm')
                    .ok(options.ok)
                    .cancel(options.cancel);

                $mdDialog.show(confirm).then(options.confirmFunction, options.cancelFunction);
            }
        }
    });