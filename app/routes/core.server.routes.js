'use strict';

module.exports = function (app) {
    // Root routing
    var core = require('../../app/controllers/core.server.controller');
    var users = require('../../app/controllers/users.server.controller');

    //    app.route('/').get(core.index);
    app.route('/api/quiz')
        .post(users.requiresAdminLogin, core.create)
        .put(users.requiresAdminLogin, core.update)
        .get(users.requiresAdminLogin, core.list);

    app.route('/api/quiz/:quizId')
        .get(users.requiresAdminLogin, core.read)
        .delete(users.requiresAdminLogin, core.delete);

    app.route('/api/quiz/push-question')
        .post(users.requiresAdminLogin, core.pushQuestion);

    app.route('/api/quiz/changeStatus')
        .post(users.requiresAdminLogin, core.changeQuizStatus);

    app.route('/api/getDashboard')
        .get(users.requiresAdminLogin, core.getDashboardDetails);

    app.route('/api/quiz-list')
        .get(core.listSetsForApp);

    app.route('/api/quiz-questions/:quizId')
        .get(core.quizQuestionsForApp);

    app.route('/api/quiz-submit')
        .post(core.submitQuizForApp);

};
