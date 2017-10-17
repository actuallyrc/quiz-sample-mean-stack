angular.module('home').controller('CommonCtrl', function ($scope, sessionService, $state, $timeout) {

    $scope.currentUser = sessionService.user;
    $scope.logout = function () {
        sessionService.logout().then(function () {
            $scope.currentUser = {};
            $state.go('login');
        });
    };
    $scope.$on('successMessage', function (event, arg) {
        $scope.successMessage = arg.msg;
        $scope.showMessage = true;
        $timeout(function () {
            $scope.showMessage = false;
        }, 3000);

    });

    $scope.$on('errorMessage', function (event, arg) {
        $scope.errMessage = arg.msg;
        $scope.showErrMessage = true;
        $timeout(function () {
            $scope.showErrMessage = false;
        }, 3000);

    });
});
