const { body, validationResult } = require('express-validator');
const async = require('async');
const Spell = require('../models/spell');
const Enchantment = require('../models/enchantment');
const { handleDeletion } = require('./handleDeletion');
const Character = require('../models/character');

// Returns details of a cerrtain spell
exports.get_spell_details = (req, res, next) => {
  Spell.findById(req.params.id)
    .exec((err, spell) => {
      if (err) return res.status(404).json({ err, msg: 'Error retrieving spell' });
      if (!spell) return res.status(404).json({ err, msg: 'Spell does not exist' });
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
      if (err) return res.status(404).json({ err, msg: 'Error retrieving spells' });
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
    .optional({ checkFalsy: true })
    .escape(),
  body('damageType*', 'Spell must have a damage type.')
    .trim()
    .optional({ checkFalsy: true })
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
      return res.status(404).json({
        data: req.body, errors: errors.array(),
      });
    }
    Spell.findOne({
      name: req.body.name,
      magics: req.body.magics,
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
        if (err) return res.status(404).json({ err, msg: 'Error retrieving replica' });
        if (!replica) {
          const spell = new Spell({});
          spell.name = req.body.name;
          Object.keys(req.body).forEach((key) => {
            if (req.body[key] != undefined && req.body[key] != [] && key != 'name') {
              spell[key] = req.body[key];
            }
          });
          spell.save((err) => {
            if (err) return res.status(404).json({ err, msg: 'Failed to save spell' });
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
    .optional({ checkFalsy: true })
    .escape(),
  body('damageType*', 'Spell must have a damage type.')
    .trim()
    .optional({ checkFalsy: true })
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
      return res.status(404).json({
        data: req.body, errors: errors.array(),
      });
    }

    Spell.findOne({
      name: req.body.name,
      magics: req.body.magic,
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
        if (err) return res.status(404).json({ err, msg: 'Error retrieving replica' });
        if (!replica || replica._id == req.body._id) {
          Spell.findById(req.body._id)
            .exec((err, spell) => {
              if (err) return res.status(404).json({ err, msg: 'Error retrieving spell' });
              if (!spell) return res.status(404).json({ msg: 'Spell does not exist' });
              spell.name = req.body.name;
              Object.keys(req.body).forEach((key) => {
                if (req.body[key] != undefined && req.body[key] != [] && key !== 'name') {
                  spell[key] = req.body[key];
                }
              });
              spell.save((err) => {
                if (err) return res.status(404).json({ err, msg: 'Failed to save spell' });
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
  async.parallel({
    character(callback) {
      Character.find({ spells: req.params.id })
        .exec(callback);
    },
    enchant(callback) {
      Enchantment.find({ spell: req.params.id })
        .exec(callback);
    },
    spell(callback) {
      Spell.find({ followUp: req.params.id })
        .exec(callback);
    },
  }, (err, results) => {
    if (err) return res.status(404).json({ err, msg: 'Error retrieving results' });
    return handleDeletion(results, 'Spell', res, req.params.id);
  });
};
