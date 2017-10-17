angular.module('home').controller('LoginCtrl', function ($scope, $http, sessionService, $location) {

    $scope.user = {};
    $scope.submitted = false;

    //    $scope.loginButton = function (valid, user) {
    //        $scope.submitted = true;
    //        if (valid) {
    //            $http.post("/auth/signin", user).success(function (data) {
    //                sessionService.user = data.user;
    //                $scope.currentUser = data.user;
    //                $location.url('/' + data.redirect);
    //            }).error(function (error) {
    //                $scope.errorMsg = error.message;
    //            });
    //        }
    //    };

    $scope.login = function (valid) {
        console.log(valid);
        $scope.submitted = true;
        if (valid) {
            $http.post('/api/auth/adminSignin', $scope.user).success(function (data) {
                sessionService.user = data.user;
                $location.url('/' + data.redirect);
            }).error(function (error) {
                $scope.errorMsg = error.message;
            });
        }
    };
});
