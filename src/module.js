var filterService = angular.module('app.filterService', [])
    .run(['$log', function ($log) {
        $log.debug('app.webservices.run()...');
    }]);