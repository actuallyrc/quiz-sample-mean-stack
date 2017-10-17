angular.module('home').controller('DashboardCtrl', function ($scope, $http) {
    $scope.report = {};
    $http.get('/api/getDashboard').then(function (success) {
        $scope.report = success.data;
    }, function (error) {
        console.log(error);
    });
});
