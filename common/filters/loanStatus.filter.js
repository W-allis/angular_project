filterService.factory('loanStatus', ['$scope', function($scope) {
    return {
        loanStatusFilter: function(input) {
            var output = ''

            switch (input) {
                case 0:
                    output = '申请中'
                    break
                case 1:
                    output = '个人信息填写中'
                    break
                case 2:
                    output = '已授额'
                    break
                default:
                    break
            }

            return output
        }
    }
}])