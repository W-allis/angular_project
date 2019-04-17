import Color from './test'
import './test.less'

// import angular from 'angularjs'
console.log(Color.yellow)

angular.module('app', [])
.directive('draggable', function($document) {
    return function(scope, elemenet, attr) {
        elemenet.on('click', function() {
            console.log('i listen the click thing')
        })
    }
})
.filter('reverse', function() {
    return function(input, uppercase) {
        var output = ''
        
        input = input || ''

        output = input.split('').reverse().join('')

        if (uppercase) {
            output = output.toUpperCase()
        }

        return output
    }
})
.directive('replaceTest', function($rootScope) {
    $rootScope.log = 'test'

    return {
        restrict: 'E',
        template: '<h1>test</h1>',
        replace: true,
        // link: function() {
        //     console.log('i linten the replaceTest click link')
        // },
        controller: function($scope, $elemenet, $attr) {

            $scope.log = 'child'

            $elemenet.on('click', function() {
                console.log('i linten the replaceTest click')
            })
        }
    }
})
.controller('Ctrl', ['$scope', 'reverseFilter', function($scope, reverseFilter) {
    $scope.greeting = 'asdfgh'

    console.log(reverseFilter)
}])

var a = 10
console.log(window)
;(function() {
    console.log(a)   // var a
                     // console.log(a)       
    a = 5            // a = 5
                     // console.log(window.a)
    console.log(window.a)

    var a = 20

    console.log(a)
})()