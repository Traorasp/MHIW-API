const { body, validationResult } = require('express-validator');
const Enchantment = require('../models/enchantment');
const Item = require('../models/item');

// Returns details of an enchantment
exports.get_enchantment_details = (req, res, next) => {
  Enchantment.findById(req.params.id)
    .populate('skill')
    .populate('spell')
    .populate('antiTalent')
    .exec((err, enchantment) => {
      if (err) return res.status(404).json({ err, msg: 'Error retrieving enchantment' });
      if (!enchantment) return res.status(404).json({ err, msg: 'Enchantment does not exists' });
      return res.json({ enchantment });
    });
};

// Returns list of all enchantments
exports.get_enchantment_list = (req, res, next) => {
  Enchantment.find()
    .exec((err, enchantments) => {
      if (err) return res.status(404).json({ err, msg: 'Error retrieving enchantments' });
      return res.json({ enchantments });
    });
};

// Creates new enchantment and returns its id
exports.post_enchantment = [
  body('amount', 'Enchantment must have an amount')
    .trim()
    .isInt({ min: 1, max: 8 })
    .withMessage('Amount must be between 1 and 8')
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({
        data: req.body,
        errors: errors.array(),
      });
    }

    Enchantment.findOne({
      amount: req.body.amount,
      skill: req.params.skill ? req.params.skill : null,
      spell: req.body.spell ? req.params.spell : null,
      antiTalent: req.body.antiTalent ? req.params.antiTalent : null,
    })
      .exec((err, replica) => {
        if (err) return res.status(404).json({ err, msg: 'Error retrieving replica enchantment' });
        if (!replica) {
          const enchantment = new Enchantment({});
          Object.keys(req.body).forEach((key) => {
            if (req.body[key] != undefined && req.body[key] != []) {
              enchantment[key] = req.body[key];
            }
          });

          enchantment.save((err) => {
            if (err) return res.status(404).json({ err, msg: 'Failed to save changes' });
            return res.json({ msg: 'Sucesfully created enchantment', enchantment });
          });
        } else {
          return res.json({ replica, msg: 'Enchantment already exists' });
        }
      });
  },
];

// Deletes a specified enchantment if no references point to it
exports.delete_enchantment = (req, res, next) => {
  Item.findOne({ enchantments: req.params.id })
    .exec((err, items) => {
      if (err) return res.status(404).json({ err, msg: 'Error retrieving item' });
      if (!items) {
        Enchantment.findByIdAndDelete(req.params.id, (err) => {
          if (err) return res.status(404).json({ err, msg: 'Failed to save enchantment' });
          return res.json({ msg: 'Enchantment succesfully deleted' });
        });
      } else {
        return res.json({ items, msg: 'Items still reference enchantment' });
      }
    });
};
