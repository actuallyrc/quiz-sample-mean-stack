'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    errorHandler = require('../errors.server.controller.js'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function (req, res) {
    // Init Variables
    var user = req.user;
    var message = null;

    // For security measurement we remove the roles from the req.body object
    delete req.body.roles;

    if (user) {
        // Merge existing user
        user = _.extend(user, req.body);
        user.updated = Date.now();
        user.displayName = user.firstName + ' ' + user.lastName;

        user.save(function (err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                req.login(user, function (err) {
                    if (err) {
                        res.status(400).send(err);
                    } else {
                        res.json(user);
                    }
                });
            }
        });
    } else {
        res.status(400).send({
            message: 'User is not signed in'
        });
    }
};

/**
 * Send User
 */
exports.me = function (req, res) {
    res.json(req.user || null);
};

/**
 * Get list of all Users
 */
exports.listUsers = function (req, res) {
    User.find({
        roles: 'user'
    }, {
        displayName: 1,
        memberType: 1,
        username: 1,
        address: 1,
        created: 1,
        status: 1
    }).exec(function (error, users) {
        if (error) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(error)
            });
        } else {
            return res.status(200).send(users);
        }
    });
};

/**
 * Change user status
 */
exports.changeUserStatus = function (req, res) {
    User.update({
        _id: req.body.userId
    }, {
        status: req.body.status
    }).exec(function (error, user) {
        if (error) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(error)
            });
        } else {
            res.status(200).send({
                message: 'User status updated successfully'
            });
        }
    });
}
