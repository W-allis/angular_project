shortMessageModule.directive('shorMessageView', ['$timeout', function($timeout) {
    return {
        restrict: 'E',
        templateUrl: 'shortMessage.component.html',
        link: function($scope) {
            $scope.handleClick = function() {
                console.log('i listen the click')
            }
        }
    }
}])