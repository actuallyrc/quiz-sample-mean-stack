angular.module('admin').factory('setsService', function ($http, $q) {

    var setsService = {};
    setsService.sets = [];
    setsService.set = {};

    setsService.getSetsList = function () {
        var deferred = $q.defer();
        $http.get('/api/quiz').then(
            function (response) {
                setsService.sets = response.data;
                deferred.resolve(response.data);
            },
            function (error) {
                deferred.reject(error);
            });
        return deferred.promise;
    };

    setsService.editSets = function (set) {
        var deferred = $q.defer();
        if (set._id) {
            $http.put('/api/quiz', set).then(
                function (response) {
                    setsService.set = set;
                    deferred.resolve(set);
                },
                function (error) {
                    deferred.reject(error);
                });
        } else {
            $http.post('/api/quiz', set).then(
                function (response) {
                    setsService.set = response.data;
                    deferred.resolve(response.data);
                },
                function (error) {
                    deferred.reject(error);
                });
        }
        return deferred.promise;
    };

    setsService.getSetDetails = function (setId) {
        var deferred = $q.defer();
        if (setId != 0) {
            $http.get('/api/quiz/' + setId).then(
                function (response) {
                    setsService.set = response.data;
                    deferred.resolve(response.data);
                },
                function (error) {
                    deferred.reject(error);
                });
        } else {
            setsService.set = {};
            deferred.resolve();
        }
        return deferred.promise;
    };

    setsService.deleteSet = function (setId) {
        var deferred = $q.defer();
        $http.delete('/api/quiz/' + setId).then(
            function (response) {
                deferred.resolve(response.data);
            },
            function (error) {
                deferred.reject(error);
            });
        return deferred.promise;
    };

    setsService.addQuestion = function (question) {
        var deferred = $q.defer();
        $http.post('/api/quiz/push-question', question).then(
            function (response) {
                deferred.resolve(response.data);
            },
            function (error) {
                deferred.reject(error);
            });
        return deferred.promise;
    };

    setsService.changeStatus = function (setId, status) {
        var deferred = $q.defer();
        $http.post('/api/quiz/changeStatus', {
            setId: setId,
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

    return setsService;
});
