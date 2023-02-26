const { body, validationResult } = require('express-validator');
const Item = require('../models/item');
const Enchantment = require('../models/enchantment');

// Returns detail of a specific item
// Uses promises since populate requires a promise
exports.get_item_details = (req, res, next) => {
  Item.findById(req.params.id)
    .exec((err, item) => {
      if (err) return res.status(404).json({ err, msg: 'Error retrieving item' });
      if (!item) return res.status(404).json({ err, msg: 'No such item exists' });
      const promises = [];
      Object.entries(item._doc).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          promises.push(item.populate(key));
        } else if (value === 'material' && key !== '') {
          promises.push(item.populate(key));
        }
      });
      return Promise.all(promises).then(() => res.json({ item }));
    });
};

// Returns list of all items
exports.get_item_list = (req, res, next) => {
  Item.find()
    .exec((err, items) => {
      if (err) return res.status(404).json({ err, msg: 'Error retrieving items' });
      return res.json({ items });
    });
};

// Creates a new item and returns it
exports.post_item = [
  body('name', 'Item must have name.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('rarity', 'Item must have a rarity')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('level', 'Item must have a level')
    .trim()
    .isInt({ min: 1, max: 15 })
    .withMessage('Level must be between 1 and 15')
    .escape(),
  body('cost', 'Iteme must have a positive cost')
    .trim()
    .optional({ checkFalsy: true })
    .isInt({ min: 0 })
    .escape(),
  body('type', 'Item must have a type specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('baseStats', '')
    .optional({ checkFalsy: true })
    .custom((stats) => {
      Object.values(stats).forEach((values) => {
        if (values < 0) {
          throw new Error('Stats cannot be negative');
        }
      });
      return true;
    }),
  body('description', '')
    .trim()
    .optional({ checkFalsy: true })
    .escape(),
  body('background', '')
    .trim()
    .optional({ checkFalsy: true })
    .escape(),
  body('enchantments', '')
    .optional({ checkFalsy: true })
    .custom((enchantments, { req }) => {
      let count = 0;

      enchantments.forEach((id) => {
        Enchantment.findById(id)
          .exec((err, enchant) => {
            if (err) throw new Error('Error checking enchants');
            count += enchant.amount;
          });
      });
      let max = 0;
      switch (req.body.rarity) {
        case 'Very Common':
          max = 1;
          break;
        case 'Common':
          max = 2;
          break;
        case 'UnCommon':
          max = 3;
          break;
        case 'Rare':
          max = 4;
          break;
        case 'Unique':
          max = 5;
          break;
        case 'Epic':
          max = 6;
          break;
        case 'Legendary':
          max = 7;
          break;
        case 'Mythical':
          max = 8;
          break;
        case 'Quasi Artifact':
          max = 9;
          break;
        case 'Artifact':
          max = 10;
          break;
        default:
          throw new Error('Rarity does not exist');
      }
      if (count <= max) {
        return true;
      }
      throw new Error(`Maximum amount of enchantments for item is ${max} currently has ${count}`);
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({
        data: req.body,
        errors: errors.array(),
      });
    }
    const item = new Item({});
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] != undefined && req.body[key] != []) {
        item[key] = req.body[key];
      }
    });

    item.save((err) => {
      if (err) return res.status(404).json({ err, msg: 'Failed to save changes' });
      return res.json({ msg: 'Sucesfully created item', item });
    });
  },
];

// Updates a specified item
exports.post_update_item = [
  body('name', 'Item must have name.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('rarity', 'Item must have a rarity')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('level', 'Item must have a level')
    .trim()
    .isInt({ min: 1, max: 15 })
    .withMessage('Level must be between 1 and 15')
    .escape(),
  body('cost', 'Iteme must have a positive cost')
    .trim()
    .optional({ checkFalsy: true })
    .isInt({ min: 0 })
    .escape(),
  body('type', 'Item must have a type specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('baseStats', '')
    .optional({ checkFalsy: true })
    .custom((stats) => {
      Object.values(stats).forEach((values) => {
        if (values < 0) {
          throw new Error('Stats cannot be negative');
        }
      });
      return true;
    }),
  body('description', '')
    .trim()
    .optional({ checkFalsy: true })
    .escape(),
  body('background', '')
    .trim()
    .optional({ checkFalsy: true })
    .escape(),
  body('enchantments', '')
    .optional({ checkFalsy: true })
    .custom((enchantments, { req }) => {
      let count = 0;

      enchantments.forEach((id) => {
        Enchantment.findById(id)
          .exec((err, enchant) => {
            if (err) throw new Error('Error checking enchants');
            count += enchant.amount;
          });
      });
      let max = 0;
      switch (req.body.rarity) {
        case 'VeryCommon':
          max = 1;
          break;
        case 'Common':
          max = 2;
          break;
        case 'UnCommon':
          max = 3;
          break;
        case 'Rare':
          max = 4;
          break;
        case 'Unique':
          max = 5;
          break;
        case 'Epic':
          max = 6;
          break;
        case 'Legendary':
          max = 7;
          break;
        case 'Mythical':
          max = 8;
          break;
        case 'Quasi Artifact':
          max = 9;
          break;
        case 'Artifact':
          max = 10;
          break;
        default:
          throw new Error('Rarity does not exist');
      }
      if (count <= max) {
        return true;
      }
      throw new Error(`Maximum amount of enchantments for item is ${max} currently has ${count}`);
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({
        data: req.body,
        errors: errors.array(),
      });
    }

    Item.findById(req.body._id)
      .exec((err, item) => {
        if (err) return res.status(404).json({ err, msg: 'Error retrieving item' });
        if (!item) return res.json({ msg: 'No such item exists' });
        Object.keys(req.body).forEach((key) => {
          if (req.body[key] != undefined && req.body[key] != []) {
            item[key] = req.body[key];
          }
        });
        item.save((err) => {
          if (err) return res.json({ err, msg: 'Failed to save changes' });
          return res.json({ msg: 'Sucesfully updated item', item });
        });
      });
  },
];

// Deletes a specified item
exports.delete_item = (req, res, next) => {
  Item.findById(req.params.id)
    .exec((err, item) => {
      if (err) return res.status(404).json({ err, msg: 'Error retrieving item' });
      if (!item) return res.status(404).json({ err, msg: 'Item does not exist' });
      item.remove((err) => {
        if (err) return res.status(404).json({ msg: 'Failed to remove item' });
        return res.json({ msg: 'Sucesfully removed item' });
      });
    });
};
