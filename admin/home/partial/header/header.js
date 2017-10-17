angular.module('home').controller('HeaderCtrl', function ($scope, sessionService) {

    $scope.currentUser = angular.copy(sessionService.user);
});
