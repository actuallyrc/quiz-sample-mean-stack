angular.module('home').controller('SetsCtrl', function ($scope, setsService) {

    $scope.sets = angular.copy(setsService.sets);

    $scope.removeSet = function (setId, index) {
        $scope.sets.splice(index, 1);
        var promise = setsService.deleteSet(setId);
        promise.then(function (success) {
            if (success) {}
        }, function (error) {
            console.log(error);
        });
    };

    $scope.changeStatus = function (setId, status, index) {
        var promise1 = setsService.changeStatus(setId, status);
        promise1.then(function (success) {
            if (success) {
                $scope.sets[index].status = status;
            }
        }, function (error) {
            console.log(error);
        });
    };
});
