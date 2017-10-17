angular.module('home').controller('UserdetailsCtrl', function ($scope, sessionService, $stateParams, setsService) {

    $scope.userId = $stateParams.userId;
    $scope.report = sessionService.userPerformance;

    $scope.assignSummary = function (summary) {
        setsService.summary = summary;
    }

});
