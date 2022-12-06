const { body, validationResult } = require('express-validator');
const Enchantment = require('../models/enchantment');
const Item = require('../models/item');

// Returns details of an enchantment
exports.get_enchantment_details = (req, res, next) => {
  Enchantment.findById(req.params.id)
    .exec((err, enchant) => {
      if (err) return res.status(404).json({ err, msg: 'Error retrieving enchantment' });
      if (!enchant) return res.status(404).json({ err, msg: 'Enchantment does not exists' });
      if (enchant.skill !== '') {
        enchant.populate('skill');
      } else if (enchant.spell !== '') {
        enchant.populate('spell');
      }
      return res.json({ enchant });
    });
};

// Returns list of all enchantments
exports.get_enchantment_list = (req, res, next) => {
  Enchantment.find()
    .exec((err, enchants) => {
      if (err) return res.status(404).json({ err, msg: 'Error retrieving enchantments' });
      return res.json({ enchants });
    });
};

// Creates new enchantment and returns its id
exports.post_enchantment = [
  body('level', 'Item must have a level')
    .trim()
    .isInt({ min: 1, max: 18 })
    .withMessage('Level must be between 1 and 18')
    .escape(),
  body('amount', 'Item must have an amount')
    .trim()
    .isInt({ min: 1, max: 8 })
    .withMessage('Amount must be between 1 and 8')
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        data: req.body,
        errors: errors.array(),
      });
    }

    Enchantment.findOne({
      level: req.body.level,
      amount: req.body.amount,
      skill: req.params.skill,
      spell: req.body.spell,
    })
      .exec((err, replica) => {
        if (err) return res.status(404).json({ err, msg: 'Error retrieving replica enchantment' });
        if (!replica) {
          const enchant = new Enchantment({});
          Object.keys(req.body).forEach((key) => {
            if (req.body[key] != undefined && req.body[key] != []) {
              enchant[key] = req.body[key];
            }
          });

          enchant.save((err) => {
            if (err) return res.status(404).json({ err, msg: 'Failed to save changes' });
            return res.json({ msg: 'Sucesfully created enchantment', enchant });
          });
        } else {
          return res.json({ replica, msg: 'Enchantment already exists' });
        }
      });
  },
];

// Deletes a specified enchantment if no references point to it
exports.delete_enchantment = (req, res, next) => {
  Item.find({ enchantments: req.params.id })
    .exec((err, items) => {
      if (err) return res.status(404).json({ err, msg: 'Error retrieving item' });
      if (items.length < 1) {
        Enchantment.findByIdAndDelete(req.params.id, (err) => {
          if (err) return res.status(404).json({ err, msg: 'Failed to save enchantment' });
          return res.json({ msg: 'Enchantment succesfully deleted' });
        });
      } else {
        return res.json({ items, msg: 'Items still reference enchantment' });
      }
    });
};
