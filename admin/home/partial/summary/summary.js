angular.module('home').controller('SummaryCtrl', function ($scope, setsService) {

    $scope.result = {};
    if (setsService.summary) {
        $scope.result = setsService.summary.resultSummary;
        $scope.result.title = setsService.summary.title;
    }

    $scope.back = function () {
        window.history.back();
    }
});
