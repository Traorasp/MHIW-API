const { body, validationResult } = require('express-validator');
const Effect = require('../models/effect');

// Returnsall effects in the database
exports.get_effect_list = (req, res, next) => {

};

// Creates a new effect if the requested effect doesn't already exist in the database
// return reference to old or new efffect
exports.post_effect = (req, res, next) => {

};

// Deletes effect if there is no other reference to it
// WIP FINISH WHEN ALL OTHER MODELS THAAT USE EFFECT ARE DONE
exports.delete_effect = (req, res, next) => {

};
