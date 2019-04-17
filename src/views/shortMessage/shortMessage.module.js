var shortMessageModule = angular.module('app.shortMessage', [])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('shortMessagePlatform', {
            name: 'shortMessagePlatform',
            url: '/shortMessage',
            templateUrl: './shortMessage.html'
        })
    }])

export default shortMessageModule