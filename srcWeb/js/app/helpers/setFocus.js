angular
    .module('core')
    .directive('setFocus', function ($timeout) {
        return {
            link: function (scope, element, attrs) {
                scope.$watch(attrs.setFocus, function (value) {
                    if (value === true) {
                        $timeout(function () {
                            element[0].focus();
                            scope[attrs.setFocus] = false;
                        });
                    }
                });
            }
        };
    });