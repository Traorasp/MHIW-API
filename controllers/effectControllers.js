const { body, validationResult } = require('express-validator');
const async = require('async');
const Effect = require('../models/effect');
const Character = require('../models/character');
const Item = require('../models/item');
const Material = require('../models/material');
const Race = require('../models/race');
const Skill = require('../models/skill');
const Spell = require('../models/spell');
const Title = require('../models/title');
const Classes = require('../models/classes');
const { handleDeletion } = require('./handleDeletion');

// Returns informatin of a specific effect
exports.get_effect = (req, res, next) => {
  Effect.findById(req.params.id)
    .exec((err, effect) => {
      if (err) return res.status(404).json({ err, msg: 'Failed to retrieve effect' });
      if (!effect) return res.status(404).json({ err, msg: 'Effect does not exist' });
      return res.json({ effect });
    });
};

// Returns all effects in the database
exports.get_effect_list = (req, res, next) => {
  Effect.find()
    .exec((err, effects) => {
      if (err) return res.status(404).json({ err, msg: 'Failed to retrieve effect' });
      return res.json({ effects });
    });
};

// Creates a new effect if the requested effect doesn't already exist in the database
// return reference to old or new efffect
exports.post_effect = [
  body('name', 'Name cannot be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('damageType', '')
    .trim()
    .optional({ checkFalsy: true })
    .escape(),
  body('damage', '')
    .trim()
    .optional({ checkFalsy: true })
    .escape(),
  body('training', '')
    .trim()
    .optional({ checkFalsy: true })
    .escape(),
  body('stat', '')
    .trim()
    .optional({ checkFalsy: true })
    .escape(),
  body('property', '')
    .trim()
    .optional({ checkFalsy: true })
    .escape(),
  body('effect', '')
    .trim()
    .optional({ checkFalsy: true })
    .escape(),
  body('duration', 'Duration cannot be empty')
    .trim()
    .isInt({ min: 1 })
    .withMessage('Duration cannot be less than 1 round')
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ data: req.body, errors });
    }

    Effect.findOne({
      name: req.body.name,
      damageType: req.body.damageType,
      damage: req.body.damage,
      training: req.body.training,
      stat: req.body.stat,
      property: req.body.property,
      effect: req.body.effect,
      duration: req.body.duration,
    })
      .exec((err, replica) => {
        if (err) return res.status(404).json({ err, msg: 'Error retrieving replica' });
        if (!replica) {
          const effect = new Effect({
            name: req.body.name,
            damageType: req.body.damageType,
            damage: req.body.damage,
            training: req.body.training,
            stat: req.body.stat,
            property: req.body.property,
            effect: req.body.effect,
            duration: req.body.duration,
          });
          effect.save((err) => {
            if (err) return res.status(404).json({ err, msg: 'Failed to save effect' });
            return res.json({ effect, msg: 'Succesfully created new effect' });
          });
        } else return res.json({ replica, msg: 'Effect already exists' });
      });
  },
];

exports.post_update_effect = [
  body('name', 'Name cannot be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('damageType', '')
    .trim()
    .optional({ checkFalsy: true })
    .escape(),
  body('damage', '')
    .trim()
    .optional({ checkFalsy: true })
    .escape(),
  body('training', '')
    .trim()
    .optional({ checkFalsy: true })
    .escape(),
  body('stat', '')
    .trim()
    .optional({ checkFalsy: true })
    .escape(),
  body('property', '')
    .trim()
    .optional({ checkFalsy: true })
    .escape(),
  body('effect', '')
    .trim()
    .optional({ checkFalsy: true })
    .escape(),
  body('duration', 'Duration cannot be empty')
    .trim()
    .isInt({ min: 1 })
    .withMessage('Duration cannot be less than 1 round')
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ data: req.body, errors });
    }

    Effect.findOne({
      name: req.body.name,
      damageType: req.body.damageType,
      show: req.body.show,
      damage: req.body.damage,
      training: req.body.training,
      stat: req.body.stat,
      property: req.body.property,
      effect: req.body.effect,
      duration: req.body.duration,
    })
      .exec((err, replica) => {
        if (err) return res.status(404).json({ err, msg: 'Error retrieving replica' });
        if (!replica) {
          const data = {
            _id: req.body._id,
            name: req.body.name,
            show: req.body.show,
            damageType: req.body.damageType,
            damage: req.body.damage,
            training: req.body.training,
            stat: req.body.stat,
            property: req.body.property,
            effect: req.body.effect,
            duration: req.body.duration,
          };
          Effect.findByIdAndUpdate(req.body._id, data, (err, effect) => {
            if (err) return res.status(404).json({ err, msg: 'Failed to save effect' });
            return res.json({ effect, msg: 'Succesfully updated effect' });
          });
        } else return res.json({ replica, msg: 'Effect already exists' });
      });
  },
];

// Deletes effect if there are no other reference to it
exports.delete_effect = (req, res, next) => {
  async.parallel({
    character(callback) {
      Character.find({ status: req.params.id })
        .exec(callback);
    },
    item(callback) {
      Item.find({ subStats: req.params.id })
        .exec(callback);
    },
    material(callback) {
      Material.find({ effects: req.params.id })
        .exec(callback);
    },
    race(callback) {
      Race.find({ training: req.params.id })
        .exec(callback);
    },
    skill(callback) {
      Skill.find({ effects: req.params.id })
        .exec(callback);
    },
    spell(callback) {
      Spell.find({ effects: req.params.id })
        .exec(callback);
    },
    title(callback) {
      Title.find({ effects: req.params.id })
        .exec(callback);
    },
    classes(callback) {
      Classes.find({ effects: req.params.id })
        .exec(callback);
    },
  }, (err, results) => {
    if (err) return res.status(404).json({ err, msg: 'Error retrieving results' });
    return handleDeletion(results, 'Effect', res, req.params.id);
  });
};
