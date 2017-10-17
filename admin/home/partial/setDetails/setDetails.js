angular.module('home').controller('SetdetailsCtrl', function ($scope, setsService, $state) {

    if (setsService.set) {
        $scope.quiz = angular.copy(setsService.set);
        if (!$scope.quiz.questions) {
            $scope.quiz.questions = [];
        }
    } else {
        $scope.quiz = {};
        $scope.quiz.questions = [];
    }
    $scope.question = {};
    $scope.question.opts = [];
    $scope.submitted = false;
    $scope.quesSubmitted = false;
    $scope.err1 = false;
    $scope.err2 = false;
    $scope.err3 = false;
    $scope.err4 = false;
    $scope.anserr = false;
    var questionIndex = null;

    $scope.addQuizSet = function (valid) {
        $scope.submitted = true;
        if (valid) {
            var promise = setsService.editSets($scope.quiz);
            promise.then(function (success) {
                if (success) {
                    $state.go('common.set', {
                        setId: success._id
                    });
                }
            }, function (error) {
                console.log(error);
            });
        }
    };

    $scope.addQuestion = function (valid) {
        $scope.quesSubmitted = true;
        if (!$scope.question.opts[0]) {
            $scope.err1 = true;
        } else {
            $scope.err1 = false;
        }
        if (!$scope.question.opts[1]) {
            $scope.err2 = true;
        } else {
            $scope.err2 = false;
        }
        if (!$scope.question.opts[2]) {
            $scope.err3 = true;
        } else {
            $scope.err3 = false;
        }
        if (!$scope.question.opts[3]) {
            $scope.err4 = true;
        } else {
            $scope.err4 = false;
        }
        if (!$scope.question.answeropt) {
            $scope.anserr = true;
        } else {
            $scope.anserr = false;
        }
        if (valid && $scope.question.opts.length == 4 && $scope.question.answeropt) {
            $scope.question.answer = $scope.question.opts[$scope.question.answeropt - 1];
            if (questionIndex !== null) {
                console.log(questionIndex);
                $scope.quiz.questions[questionIndex] = $scope.question;
                questionIndex = null;
            } else {
                $scope.quiz.questions.push($scope.question);
            }
            var promise = setsService.editSets($scope.quiz);
            promise.then(function (success) {
                if (success) {
                    $scope.quiz = setsService.set;
                    $scope.question = {};
                    $scope.question.opts = [];
                    $scope.quesSubmitted = false;
                }
            }, function (error) {
                console.log(error);
            });
        }
    };

    $scope.edit = function (index) {
        $scope.question = $scope.quiz.questions[index];
        questionIndex = index;
        for (var i = 0; i < $scope.question.opts.length; i++) {
            if ($scope.question.answer == $scope.question.opts[i]) {
                $scope.question.answeropt = i + 1;
            }
        }
    }

    $scope.removeQuestion = function (index) {
        $scope.quiz.questions.splice(index, 1);
        var promise = setsService.editSets($scope.quiz);
        promise.then(function (success) {
            if (success) {
                $scope.quiz = setsService.set;
                $scope.question = {};
                $scope.question.opts = [];
                $scope.quesSubmitted = false;
            }
        }, function (error) {
            console.log(error);
        });
    };
});
