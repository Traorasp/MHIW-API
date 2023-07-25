const { body, validationResult } = require('express-validator');
const async = require('async');
const AOE = require('../models/aoe');
const Spell = require('../models/spell');
const Skill = require('../models/skill');
const { handleDeletion } = require('./handleDeletion');

// Returns specific aoe
exports.get_aoe = (req, res, next) => {
  AOE.findById(req.params.id)
    .exec((err, aoe) => {
      if (err) return res.status(404).json({ err, msg: 'Error getting aoe' });
      if (!aoe) return res.status(404).json({ err, msg: 'No such aoe exists' });
      return res.json({ aoe });
    });
};

// Returns list of all aoe
exports.get_aoe_list = (req, res, next) => {
  AOE.find()
    .exec((err, aoes) => {
      if (err) return res.status(404).json({ err, msg: 'Error getting aoe list' });
      return res.json({ aoes });
    });
};

// Creates a new aoe in datatbase if it already doesn't exist and returns it
exports.post_aoe = [
  body('name', 'Name cannot be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('fixed', 'Fixed condition cannot be empty')
    .isBoolean()
    .escape(),
  body('range', 'Range cannot be empty')
    .trim()
    .isInt({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ data: req.body, errors });
    }

    AOE.findOne({
      name: req.body.name,
      fixed: req.body.fixed,
      range: req.body.range,
    })
      .exec((err, replica) => {
        if (err) return res.status(404).json({ err, msg: 'Error retrieving aoe replica' });
        if (!replica) {
          const aoe = new AOE({
            name: req.body.name,
            fixed: req.body.fixed,
            range: req.body.range,
          });
          aoe.save((err) => {
            if (err) return res.status(404).json({ err, msg: 'Failed to save aoe' });
            return res.json({ aoe, msg: 'Succesfully created new AOE' });
          });
        } else return res.json({ replica, msg: 'AOE already exists' });
      });
  },
];

// Updates a aoe in datatbase if exact one doesn't already exist and returns it
exports.post_update_aoe = [
  body('name', 'Name cannot be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('fixed', 'Fixed condition cannot be empty')
    .isBoolean()
    .escape(),
  body('range', 'Range cannot be empty')
    .trim()
    .isInt({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ data: req.body, errors });
    }

    AOE.findOne({
      name: req.body.name,
      fixed: req.body.fixed,
      range: req.body.range,
    })
      .exec((err, replica) => {
        if (err) return res.status(404).json({ err, msg: 'Error retrieving aoe replica' });
        if (!replica) {
          const data = {
            _id: req.body._id,
            name: req.body.name,
            fixed: req.body.fixed,
            range: req.body.range,
          };
          AOE.findByIdAndUpdate(req.body._id, data, (err, aoe) => {
            if (err) return res.status(404).json({ err, msg: 'Failed to save aoe' });
            return res.json({ aoe, msg: 'Succesfully updated AOE' });
          });
        } else return res.json({ replica, msg: 'AOE already exists' });
      });
  },
];

// Deletes a spell from its magic and then itself
exports.delete_aoe = (req, res, next) => {
  async.parallel({
    spell(callback) {
      Spell.find({ aoes: req.params.id })
        .exec(callback);
    },
    skill(callback) {
      Skill.find({ aoes: req.params.id })
        .exec(callback);
    },
  }, (err, results) => {
    if (err) return res.status(404).json({ err, msg: 'Error retrieving results' });
    return handleDeletion(results, 'AOE', res, req.params.id);
  });
};
