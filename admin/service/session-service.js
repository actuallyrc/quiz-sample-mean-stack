angular.module('admin').factory('sessionService', function ($http, $q) {

    var sessionService = {};
    sessionService.user = {};
    sessionService.usersList = [];
    sessionService.userPerformance = {};

    sessionService.logout = function () {
        var deferred = $q.defer();
        $http.get('/api/auth/signout')
            .then(function (sData) {
                if (sData) {
                    sessionService.user = {};
                    deferred.resolve();
                } else {
                    deferred.resolve();
                }
            }, function (eData) {
                deferred.reject();
            });

        return deferred.promise;

    };

    sessionService.getSessionUser = function () {
        var deferred = $q.defer();
        $http.get('/api/users/me')
            .then(function (sData) {
                if (sData.data && sData.data._id) {
                    sessionService.user = sData.data;
                    deferred.resolve(sessionService.user);
                } else {
                    sessionService.user = {};
                    deferred.resolve(sessionService.user);
                }
            }, function (eData) {
                deferred.reject();
            });

        return deferred.promise;
    };

    sessionService.getUserList = function () {
        var deferred = $q.defer();
        $http.get('/api/users').then(
            function (response) {
                sessionService.usersList = response.data;
                deferred.resolve(response.data);
            },
            function (error) {
                deferred.reject(error);
            });
        return deferred.promise;
    };

    sessionService.getUserPerformance = function (userId) {
        var deferred = $q.defer();
        $http.get('/api/users/' + userId).then(
            function (response) {
                sessionService.userPerformance = response.data;
                deferred.resolve(response.data);
            },
            function (error) {
                deferred.reject(error);
            });
        return deferred.promise;
    };

    sessionService.changeStatus = function (userId, status) {
        var deferred = $q.defer();
        $http.post('/api/user/changeStatus', {
            userId: userId,
            status: status
        }).then(
            function (response) {
                deferred.resolve(response.data);
            },
            function (error) {
                deferred.reject(error);
            });
        return deferred.promise;
    };

    return sessionService;
});
