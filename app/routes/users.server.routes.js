'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function (app) {
    // User Routes
    var users = require('../../app/controllers/users.server.controller');
    var core = require('../../app/controllers/core.server.controller');

    // Setting up the users profile api
    app.route('/api/users/me').get(users.me);
    //    app.route('/api/users').put(users.update);
    //    app.route('/api/users/accounts').delete(users.removeOAuthProvider);

    // Setting up the users password api
    app.route('/api/users/changePassword').post(users.changePassword);
    app.route('/api/auth/forgot').post(users.forgot);
    //    app.route('/api/auth/reset/:token').get(users.validateResetToken);
    //    app.route('/api/auth/reset/:token').post(users.reset);

    // Setting up the users authentication api
    app.route('/api/auth/signup').post(users.signup);
    app.route('/api/auth/adminSignin').post(users.adminSignin);
    app.route('/api/auth/signin').post(users.signin);
    app.route('/api/auth/signout').get(users.signout);

    // Setting the facebook oauth routes
    app.route('/api/auth/facebook').get(passport.authenticate('facebook', {
        scope: ['email']
    }));
    app.route('/api/auth/facebook/callback').get(users.oauthCallback('facebook'));

    // Setting the twitter oauth routes
    app.route('/api/auth/twitter').get(passport.authenticate('twitter'));
    app.route('/api/auth/twitter/callback').get(users.oauthCallback('twitter'));

    // Setting the google oauth routes
    app.route('/api/auth/google').get(passport.authenticate('google', {
        scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email'
		]
    }));
    app.route('/api/auth/google/callback').get(users.oauthCallback('google'));

    // Setting the linkedin oauth routes
    app.route('/api/auth/linkedin').get(passport.authenticate('linkedin'));
    app.route('/api/auth/linkedin/callback').get(users.oauthCallback('linkedin'));

    // Setting the github oauth routes
    app.route('/api/auth/github').get(passport.authenticate('github'));
    app.route('/api/auth/github/callback').get(users.oauthCallback('github'));

    //get users details for admin
    app.route('/api/users')
        .get(users.requiresAdminLogin, users.listUsers);

    app.route('/api/users/:userId')
        .get(users.requiresAdminLogin, core.getUsersPerformance);

    app.route('/api/user/changeStatus')
        .post(users.requiresAdminLogin, users.changeUserStatus);

    // Finish by binding the user middleware
    app.param('userId', users.userByID);
};
