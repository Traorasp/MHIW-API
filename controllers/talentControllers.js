const { body, validationResult } = require('express-validator');
const async = require('async');
const Talent = require('../models/talent');
const Character = require('../models/character');
const Enchantment = require('../models/enchantment');
const { handleDeletion } = require('./handleDeletion');

// Returns one talent
exports.get_talent = (req, res, next) => {
  Talent.findById(req.params.id)
    .exec((err, talent) => {
      if (err) return res.status(404).json({ err, msg: 'Error retrieving talent' });
      if (!talent) return res.status(404).json({ err, msg: 'Talent does not exist' });
      return res.json({ talent });
    });
};

// Returns list of all talents
exports.get_talent_list = (req, res, next) => {
  Talent.find()
    .exec((err, talent) => {
      if (err) return res.status(404).json({ err, msg: 'Error retrieving talents' });
      return res.json({ talent });
    });
};

// Creates a new talent in datatbase if it already doesn't exist and returns it
exports.post_talent = [
  body('name', 'Talent name cannot be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('talent', 'Main talent cannot be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('priority', 'Talent priority cannot be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('measurements.*', 'Talent measurements cannot be empty')
    .trim()
    .isLength({ min: 0 })
    .escape(),
  body('castTime', 'Talent cast time must be a positive number')
    .trim()
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .escape(),
  body('duration', 'Talent duration cannot be empty')
    .trim()
    .isInt({ min: 0 })
    .withMessage('Duration cannot be a negative number')
    .escape(),
  body('cooldown', 'Talent cooldown must be a positive number')
    .trim()
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .escape(),
  body('charges', 'Talent charges must be a positive number')
    .trim()
    .optional({ checkFalsy: true })
    .escape(),
  body('description', 'Talent description cannot be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ data: req.body, errors });
    }

    Talent.findOne({
      name: req.body.name,
      talent: req.body.talent,
      priority: req.body.priority,
      measurements: req.body.measurements,
      castTime: req.body.castTime,
      duration: req.body.duration,
      cooldown: req.body.cooldown,
      charges: req.body.charges,
      description: req.body.description,
    })
      .exec((err, replica) => {
        if (err) return res.status(404).json({ err, msg: 'Error retrieving replica' });
        if (!replica) {
          const talent = new Talent({
            name: req.body.name,
            talent: req.body.talent,
            parent: req.body.parent,
            priority: req.body.priority,
            measurements: req.body.measurements,
            castTime: req.body.castTime,
            duration: req.body.duration,
            cooldown: req.body.cooldown,
            charges: req.body.charges,
            description: req.body.description,
          });
          talent.save((err) => {
            if (err) return res.status(404).json({ err, msg: 'Failed to save talent' });
            return res.json({ talent, msg: 'Succesfully created new talent' });
          });
        } else return res.json({ replica, msg: 'Talent already exists' });
      });
  },
];

// Updates a talent in datatbase unless exact one already exists and returns it
exports.post_update_talent = [
  body('name', 'Talent name cannot be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('talent', 'Main talent cannot be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('priority', 'Talent priority cannot be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('measurements.*', 'Talent measurements cannot be empty')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Must be atleast 3 characters long')
    .escape(),
  body('castTime', 'Talent cast time must be a positive number')
    .trim()
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .escape(),
  body('duration', 'Talent duration cannot be empty')
    .trim()
    .isInt({ min: 0 })
    .withMessage('Duration cannot be a negative number')
    .escape(),
  body('cooldown', 'Talent cooldown must be a positive number')
    .trim()
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .escape(),
  body('charges', 'Talent charges must be a positive number')
    .trim()
    .optional({ checkFalsy: true })
    .isInt({ min: 2 })
    .withMessage('Charges value must be atleast 2 or greater')
    .escape(),
  body('description', 'Talent description cannot be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ data: req.body, errors });
    }

    Talent.findOne({
      name: req.body.name,
      talent: req.body.talent,
      parent: req.body.parent,
      priority: req.body.priority,
      measurements: req.body.measurements,
      castTime: req.body.castTime,
      duration: req.body.duration,
      cooldown: req.body.cooldown,
      charges: req.body.charges,
      description: req.body.description,
    })
      .exec((err, replica) => {
        if (err) return res.status(404).json({ err, msg: 'Error retrieving replica' });
        if (!replica) {
          const data = {
            name: req.body.name,
            talent: req.body.talent,
            parent: req.body.parent,
            priority: req.body.priority,
            measurements: req.body.measurements,
            castTime: req.body.castTime,
            duration: req.body.duration,
            cooldown: req.body.cooldown,
            charges: req.body.charges,
            description: req.body.description,
          };
          Talent.findByIdAndUpdate(req.body._id, data, (err, talent) => {
            if (err) return res.status(404).json({ err, msg: 'Failed to save talent' });
            return res.json({ talent, msg: 'Succesfully updated talent' });
          });
        } else return res.json({ replica, msg: 'Talent already exists' });
      });
  },
];

// Deletes a talent from database if no talent is referencing it
exports.delete_talent = (req, res, next) => {
  async.parallel({
    character(callback) {
      Character.find({ talents: req.params.id })
        .exec(callback);
    },
    enchant(callback) {
      Enchantment.find({ antiTalent: req.params.id })
        .exec(callback);
    },
    talent(callback) {
      Talent.find({ parent: req.params.id })
        .exec(callback);
    },
  }, (err, results) => {
    if (err) return res.status(404).json({ err, msg: 'Error retrieving results' });
    return handleDeletion(results, 'Talent', res, req.params.id);
  });
};
