angular
    .module('core')
    .service('externalLink', function () {
        return {
            open : function (option) {
                window.open(option.url, option.target, 'location='+option.location);
            }
        };
    });