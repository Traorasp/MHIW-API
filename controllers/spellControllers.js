const { body, validationResult } = require('express-validator');
const Spell = require('../models/spell');
const Magic = require('../models/magic');

// Returns details of a cerrtain spell
exports.get_spell_details = (req, res, next) => {
  Spell.findById(req.params.id)
    .exec((err, spell) => {
      if (err) return res.json({ msg: 'There was an error getting spell' });
      if (!spell) return res.json({ msg: 'No such spell exists' });
      const promises = [];
      Object.entries(spell._doc).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          promises.push(spell.populate(key));
        } else if (value === 'spell' && key !== '') {
          promises.push(spell.populate(key));
        }
      });
      return Promise.all(promises).then(() => res.json({ spell }));
    });
};

// Returns list of all spells
exports.get_spell_list = (req, res, next) => {
  Spell.find()
    .exec((err, spells) => {
      if (err) return res.json({ msg: 'There was an error getting spells' });
      return res.json({ spells });
    });
};

// Creates new spell and saves it in database, returns new spell
exports.post_spell = [
  body('name', 'Spell must have name.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('type', 'Spell must have a type specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('requirements', 'Spell must have requirements.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('damageType', 'Spell must have a damage type.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('damageRatio', 'Spell must have a damage ratio between 0 and 5')
    .trim()
    .optional({ checkFalsy: true })
    .isFloat({ gt: 0, max: 5 })
    .escape(),
  body('durabilityRatio', 'Spell must have a durability ratio between 0 and 5')
    .trim()
    .optional({ checkFalsy: true })
    .isFloat({ gt: 0, max: 5 })
    .escape(),
  body('knockbackRatio', 'Spell must have a knockback ratio between 0 and 5')
    .trim()
    .optional({ checkFalsy: true })
    .isFloat({ gt: 0, max: 5 })
    .escape(),
  body('cost', 'Spell must have a positive cost')
    .trim()
    .isInt({ min: 1 })
    .escape(),
  body('range', 'Spell must have a positive range')
    .trim()
    .isInt({ min: 1 })
    .escape(),
  body('charge', 'Spell with a charge cannot have a charge of less than one')
    .trim()
    .optional({ checkFalsy: true })
    .isInt({ min: 1, allow_leading_zeroes: false })
    .escape(),
  body('description', '')
    .trim()
    .optional({ checkFalsy: true })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        data: req.body, errors: errors.array(),
      });
    }
    Spell.findOne({
      name: req.body.name,
      requirements: req.body.requirements,
      damageType: req.body.damageType,
      damageRatio: req.body.damageRatio,
      durabilityRatio: req.body.durabilityRatio,
      knockbackRatio: req.body.knockbackRatio,
      cost: req.body.cost,
      range: req.body.range,
      description: req.body.description,
      charge: req.body.charge,
    })
      .exec((err, replica) => {
        if (err) return next(err);
        if (!replica) {
          const spell = new Spell({});
          Object.keys(req.body).forEach((key) => {
            if (req.body[key] != undefined && req.body[key] != []) {
              spell[key] = req.body[key];
            }
          });
          spell.save((err) => {
            if (err) {
              return next(err);
            }
            return res.json({ spell, msg: 'Spell succesfully created' });
          });
        } else {
          return res.json({ replica, msg: 'Spell already exists' });
        }
      });
  },
];

// Update an existing spell, returns updated spell
exports.post_update_spell = [
  body('name', 'Spell must have name.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('type', 'Spell must have a type specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('requirements', 'Spell must have requirements.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('damageType', 'Spell must have a damage type.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('damageRatio', 'Spell must have a damage ratio between 0 and 5')
    .trim()
    .optional({ checkFalsy: true })
    .isFloat({ gt: 0, max: 5 })
    .escape(),
  body('durabilityRatio', 'Spell must have a durability ratio between 0 and 5')
    .trim()
    .optional({ checkFalsy: true })
    .isFloat({ gt: 0, max: 5 })
    .escape(),
  body('knockbackRatio', 'Spell must have a knockback ratio between 0 and 5')
    .trim()
    .optional({ checkFalsy: true })
    .isFloat({ gt: 0, max: 5 })
    .escape(),
  body('cost', 'Spell must have a positive cost')
    .trim()
    .isInt({ min: 0 })
    .escape(),
  body('range', 'Spell must have a positive range')
    .trim()
    .isInt({ min: 0 })
    .escape(),
  body('charge', 'Spell with a charge cannot have a charge of less than one')
    .trim()
    .optional({ checkFalsy: true })
    .isInt({ min: 1, allow_leading_zeroes: false })
    .escape(),
  body('description', '')
    .trim()
    .optional({ checkFalsy: true })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        data: req.body, errors: errors.array(),
      });
    }

    Spell.findOne({
      name: req.body.name,
      requirements: req.body.requirements,
      damageType: req.body.damageType,
      damageRatio: req.body.damageRatio,
      durabilityRatio: req.body.durabilityRatio,
      knockbackRatio: req.body.knockbackRatio,
      cost: req.body.cost,
      range: req.body.range,
      description: req.body.description,
      charge: req.body.charge,
    })
      .exec((err, replica) => {
        if (err) return next(err);
        if (!replica) {
          Spell.findById(req.body.id)
            .exec((err, spell) => {
              if (err) return next(err);
              if (!spell) return res.json({ msg: 'No such spell exists' });
              Object.keys(req.body).forEach((key) => {
                if (req.body[key] != undefined && req.body[key] != []) {
                  spell[key] = req.body[key];
                }
              });
              spell.save((err) => {
                if (err) {
                  return next(err);
                }
                return res.json({ spell, msg: 'Spell succesfully updated' });
              });
            });
        } else {
          return res.json({ replica, msg: 'Spell already exists' });
        }
      });
  },
];

// Deletes a certain spell
exports.delete_spell = (req, res, next) => {
  Magic.findOne({ spells: req.params.id })
    .exec((err, magic) => {
      if (err) return next(err);
      if (!magic) return res.json({ msg: 'No such magic exists' });
      magic.spells.splice(magic.spells.indexOf(req.params.id), 1);
      magic.save(() => {
        if (err) return next(err);
        Spell.findByIdAndDelete(req.params.id, (err) => {
          if (err) return res.json({ msg: 'Error deleting magic' });
          return res.json({ msg: 'Succesfully deletd magic' });
        });
      });
    });
};
