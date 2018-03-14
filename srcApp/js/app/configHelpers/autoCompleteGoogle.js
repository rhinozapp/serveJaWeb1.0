angular
    .module('core')
    .directive('googleplace', function() {
        return {
            require: 'ngModel',
            replace: true,
            scope: {
                ngModel: '=',
                geo: '=',
                onSelect: '&?'
            },
            link: function(scope, element, attrs, model) {
                var autocomplete = new google.maps.places.Autocomplete(element[0], {
                    types: [],
                    componentRestrictions: {
                        country: 'br'
                    }
                });

                scope.geo = autocomplete;
                google.maps.event.addListener(autocomplete, 'place_changed', function() {
                    scope.$apply(function() {
                        model.$setViewValue(element.val());
                    });
                });
            }
        };
    });