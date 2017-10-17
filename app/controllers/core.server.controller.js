'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash'),
    mongoose = require('mongoose'),
    async = require('async'),
    errorHandler = require('./errors.server.controller'),
    Quiz = mongoose.model('Quiz'),
    User = mongoose.model('User'),
    moment = require('moment-timezone');


//exports.index = function (req, res) {
//    res.render('index', {
//        user: req.user || null,
//        request: req
//  });
//};

/* Below functions for Admin */
/**
 * Create a Quiz
 */
exports.create = function (req, res) {
    console.log(req.body);
    var quiz = new Quiz(req.body);
    quiz.user = req.user._id;
    quiz.save(function (error, quiz) {
        if (error) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(error)
            });
        } else {
            return res.status(200).send(quiz);
        }
    });
};

/**
 * Read a Quiz
 */
exports.read = function (req, res) {
    console.log(req.params.quizId);
    var quiz = new Quiz(req.body);
    Quiz.findOne({
        _id: req.params.quizId
    }, {
        resultSummary: 0
    }).exec(function (error, quiz) {
        if (error) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(error)
            });
        } else {
            return res.status(200).send(quiz);
        }
    });
};

/**
 * Update a Quiz
 */
exports.update = function (req, res) {
    delete req.body.resultSummary;
    Quiz.update({
        _id: req.body._id
    }, req.body).exec(function (error, quiz) {
        if (error) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(error)
            });
        } else {
            return res.status(200).send({
                message: 'Quiz updated successfully'
            });
        }
    });
};

/**
 * Delete a Quiz
 */
exports.delete = function (req, res) {
    console.log(req.params.quizId);
    var quiz = new Quiz(req.body);
    Quiz.remove({
        _id: req.params.quizId
    }, function (error, quiz) {
        if (error) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(error)
            });
        } else {
            return res.status(200).send({
                message: 'One Quiz deleted successfully'
            });
        }
    });
};

/**
 * Get list of all Quiz
 */
exports.list = function (req, res) {
    Quiz.find({}, {
        title: 1,
        description: 1,
        created: 1,
        status: 1
    }).exec(function (error, quizes) {
        if (error) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(error)
            });
        } else {
            return res.status(200).send(quizes);
        }
    });
};

/**
 * Push Question
 */
exports.pushQuestion = function (req, res) {
    Quiz.findOneAndUpdate({
            '_id': req.body.quizId
        }, {
            $pushAll: {
                questions: req.body.question
            }
        })
        .exec(function (error, ques) {
            if (error) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(error)
                });
            } else {
                res.status(200).send(ques);
            }
        });
};

/**
 * Get user performance
 */
exports.getUsersPerformance = function (req, res) {
    var userPerformance = [];
    Quiz.find({
        'resultSummary.user': req.params.userId
    }, {
        title: 1,
        resultSummary: 1
    }).populate('resultSummary.user', 'displayName').exec(function (error, quizes) {
        if (error) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(error)
            });
        } else {
            if (quizes.length > 0) {

                async.eachSeries(quizes, function (quiz, callback) {
                    if (quiz.resultSummary && quiz.resultSummary.length > 0) {
                        async.eachSeries(quiz.resultSummary, function (summary, summaryCallback) {
                            if (summary.user._id.equals(req.params.userId)) {
                                var result = {
                                    title: quiz.title,
                                    resultSummary: summary
                                };
                                userPerformance.push(result);
                            }
                            summaryCallback();
                        }, function (err) {
                            if (err) {
                                return res.status(400).send({
                                    message: errorHandler.getErrorMessage(err)
                                });
                            } else {
                                callback();
                            }
                        });
                    } else {
                        callback();
                    }
                }, function (err) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        return res.status(200).send(userPerformance);
                    }
                });
            } else {
                return res.status(200).send(userPerformance);
            }
        }
    });
};
/* Add functions above for Admin */

/* Below functions for app */

/**
 * Get list of all Quiz for App
 */
exports.listSetsForApp = function (req, res) {
    Quiz.find({
        status: 'Active'
    }, {
        title: 1,
        description: 1,
        image: 1,
        time: 1,
        ratings: 1,
        averageRating: 1,
        instruction: 1
    }).exec(function (error, quizs) {
        if (error) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(error)
            });
        } else {
            res.status(200).send(quizs);
        }
    });
};

exports.quizQuestionsForApp = function (req, res) {
    async.waterfall([
        function (callback) {
            User.findOne({
                _id: req.user._id
            }, {
                memberType: 1,
                allowedQuiz: 1
            }).exec(function (error, user) {
                if (user.memberType == ['paid']) {
                    callback(null);
                } else if (user.memberType == ['free']) {
                    if (!allowedQuiz) {
                        User.update({
                            _id: req.user._id
                        }, {
                            allowedQuiz: req.params.quizId
                        }, function (updateErr, status) {
                            if (updateErr) {
                                return res.status(400).send({
                                    message: errorHandler.getErrorMessage(updateErr)
                                });
                            } else {
                                callback(null);
                            }
                        });
                    } else if (allowedQuiz && allowedQuiz == req.params.quizId) {
                        callback(null);
                    } else {
                        res.status(402).send({
                            message: 'Please pay to unlock this quiz'
                        });
                    }
                }
            });
        },
        function (callback) {
            Quiz.findOne({
                _id: req.params.quizId
            }, {
                questions: 1
            }).exec(function (error, quiz) {
                if (error) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(error)
                    });
                } else {
                    callback(null, quiz);
                }
            });
        }
    ], function (err, result) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.status(200).send(result);
        }
    });
};

/**
 * Submit a Quiz answer
 */
exports.submitQuizForApp = function (req, res) {
    Quiz.update({
        _id: req.body.quizId
    }, {
        $push: {
            resultSummary: req.body.resultSummary
        }
    }).exec(function (error, quiz) {
        if (error) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(error)
            });
        } else {
            return res.status(200).send({
                message: 'Quiz updated successfully'
            });
        }
    });
};

/**
 *  Change quiz status
 */
exports.changeQuizStatus = function (req, res) {
    Quiz.update({
        _id: req.body.setId
    }, {
        status: req.body.status
    }).exec(function (error, quiz) {
        if (error) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(error)
            });
        } else {
            return res.status(200).send({
                message: 'Quiz updated successfully'
            });
        }
    });
};

/**
 *  Get dashboard details
 */
exports.getDashboardDetails = function (req, res) {
    var report = {
        newUsers: 0,
        comments: 0,
        allUsers: 0,
        quizAttempts: 0
    };
    async.parallel([
        function (callback) {
            User.find({
                roles: ['user']
            }).count().exec(function (err, count) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    report.allUsers = count;
                    callback(null);
                }
            });
        },
        function (callback) {
            var startOfLastWeek = moment().subtract(6, 'days').startOf('day');
            var endOfToday = moment().endOf('day');
            console.log(startOfLastWeek.clone().toDate());
            console.log(endOfToday.clone().toDate());
            User.find({
                roles: ['user'],
                $and: [{
                    created: {
                        $gte: startOfLastWeek.clone().toDate()
                    }
                    }, {
                    created: {
                        $lte: endOfToday.clone().toDate()
                    }
                    }],
            }).count().exec(function (err, count) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    report.newUsers = count;
                    callback(null);
                }
            });
        },
        function (callback) {
            Quiz.find({}, {
                ratings: 1,
                resultSummary: 1
            }).exec(function (err1, quizes) {
                if (err1) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err1)
                    });
                } else {
                    async.eachSeries(quizes, function (quiz, seriesCallback) {
                        report.comments += quiz.ratings.length;
                        report.quizAttempts += quiz.resultSummary.length;
                        seriesCallback(null);
                    }, function (err2) {
                        if (err2) {
                            return res.status(400).send({
                                message: errorHandler.getErrorMessage(err2)
                            });
                        } else {
                            callback(null);
                        }
                    });
                }
            });
        }
    ], function (error, result) {
        if (error) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(error)
            });
        } else {
            return res.status(200).send(report);
        }
    });
};
/* Add functions above for app */
