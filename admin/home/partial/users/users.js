angular.module('home').controller('UsersCtrl', function ($scope, sessionService) {
    $scope.usersList = angular.copy(sessionService.usersList);

    $scope.changeStatus = function (userId, status, index) {
        var promise1 = sessionService.changeStatus(userId, status);
        promise1.then(function (success) {
            if (success) {
                $scope.usersList[index].status = status;
            }
        }, function (error) {
            console.log(error);
        });
    };
});
