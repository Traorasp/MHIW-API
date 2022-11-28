const { body, validationResult } = require('express-validator');
const Effect = require('../models/effect');

// Returnsall effects in the database
exports.get_effect_list = (req, res, next) => {
  Effect.find()
    .exec((err, effects) => {
      if (err) return next(err);
      if (!effects) return res.json({ msg: 'There are no effects' });
      return res.json(effects);
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
      return res.json({ data: req.body, errors });
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
      .exec((err, effect) => {
        if (err) return next(err);
        if (!effect) {
          const newEffect = new Effect({
            name: req.body.name,
            damageType: req.body.damageType,
            damage: req.body.damage,
            training: req.body.training,
            stat: req.body.stat,
            property: req.body.property,
            effect: req.body.effect,
            duration: req.body.duration,
          });
          newEffect.save(() => {
            if (err) return next(err);
            return res.json({ newEffect, msg: 'Succesfully created new effect' });
          });
        } else return res.json({ effect, msg: 'Effect already exists' });
      });
  },
];

// Deletes effect if there is no other reference to it
// WIP FINISH WHEN ALL OTHER MODELS THAAT USE EFFECT ARE DONE
exports.delete_effect = (req, res, next) => {

};
