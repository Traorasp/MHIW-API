const { body, validationResult } = require('express-validator');
const AOE = require('../models/aoe');
const Spell = require('../models/spell');

// Returns list of all aoe
exports.get_aoe = (req, res, next) => {
  AOE.find()
    .exec((err, aoe) => {
      if (err) return res.json({ msg: 'Error getting aoe list' });
      return res.json(aoe);
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
      return res.json({ data: req.body, errors });
    }

    AOE.findOne({
      name: req.body.name,
      fixed: req.body.fixed,
      range: req.body.range,
    })
      .exec((err, replica) => {
        if (err) return next(err);
        if (!replica) {
          const aoe = new AOE({
            name: req.body.name,
            fixed: req.body.fixed,
            range: req.body.range,
          });
          aoe.save((err) => {
            if (err) return next(err);
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
      return res.json({ data: req.body, errors });
    }

    AOE.findOne({
      name: req.body.name,
      fixed: req.body.fixed,
      range: req.body.range,
    })
      .exec((err, replica) => {
        if (err) return next(err);
        if (!replica) {
          const data = {
            _id: req.body.id,
            name: req.body.name,
            fixed: req.body.fixed,
            range: req.body.range,
          };
          AOE.findByIdAndUpdate(req.body.id, data, (err, aoe) => {
            if (err) return next(err);
            return res.json({ aoe, msg: 'Succesfully updated AOE' });
          });
        } else return res.json({ replica, msg: 'AOE already exists' });
      });
  },
];

// Deletes a spell from its magic and then itself
exports.delete_aoe = (req, res, next) => {
  Spell.findOne({ aoe: req.params.id })
    .exec((err, spell) => {
      if (err) return res.json({ msg: 'There was an error getting spells' });
      if (!spell) {
        AOE.findByIdAndDelete(req.params.id, (err) => {
          if (err) return res.json({ msg: 'Error deleting aoe' });
          return res.json({ msg: 'Succesfully removed aoe' });
        });
      } else {
        return res.json({ spell, msg: 'There are still spells with aoe' });
      }
    });
};
