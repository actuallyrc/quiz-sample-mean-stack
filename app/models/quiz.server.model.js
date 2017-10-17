'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Quiz Schema
 */
var QuizSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: '',
        trim: true,
        required: 'Title cannot be blank'
    },
    description: {
        type: String
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        default: 'Draft',
        enum: ['Draft', 'Active', 'Inactive']
    },
    image: {
        type: String
    },
    questions: [{
        question: {
            type: String,
            required: 'Question is required'
        },
        //        helptext: {
        //            type: String
        //        },
        marks: {
            type: Number,
            //            required: 'Marks is required'
        },
        answer: {
            type: String
        },
        opts: [{
            type: String
        }],
    }],
    totalTime: {
        type: Number
    },
    resultSummary: [{
        user: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        response: [{
            _id: {
                type: Schema.ObjectId
            },
            question: {
                type: String
            },
            answer: {
                type: String
            },
            correctAnswer: {
                type: String
            },
            correct: {
                type: Boolean
            }
        }],
        score: {
            type: Number
        },
        totalMarks: {
            type: Number
        },
        date: {
            type: Date,
            default: Date.now
        }
        }],
    ratings: [{
        user: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        rating: Number,
        comment: {
            type: String
        }
    }],
    averageRating: {
        type: Number
    },
    instruction: {
        type: String
    },
    updated: {
        type: Date
    }
});

mongoose.model('Quiz', QuizSchema);
