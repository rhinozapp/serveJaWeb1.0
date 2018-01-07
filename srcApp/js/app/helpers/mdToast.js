/**
 * Created by guilherme.assis on 06/12/2016.
 */

angular
    .module('core')
    .service('toastAction', function ($mdToast) {
        return {
            show: function(option){
                var last = {
                    bottom: option.bottom,
                    top: option.top,
                    left: option.left,
                    right: option.right
                };

                option.scope.toastPosition = angular.extend({},last);

                function sanitizePosition() {
                    var current = option.scope.toastPosition;

                    if ( current.bottom && last.top ) current.top = false;
                    if ( current.top && last.bottom ) current.bottom = false;
                    if ( current.right && last.left ) current.left = false;
                    if ( current.left && last.right ) current.right = false;

                    last = angular.extend({},current);
                }


                option.scope.getToastPosition = function() {
                    sanitizePosition();

                    return Object.keys(option.scope.toastPosition)
                        .filter(function(pos) { return option.scope.toastPosition[pos]; })
                        .join(' ');
                };


                var pin = option.scope.getToastPosition();
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(option.text)
                        .position(pin)
                        .hideDelay(3000)
                );
            }
        };
    });