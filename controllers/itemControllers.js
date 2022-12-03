const { body, validationResult } = require('express-validator');
const Item = require('../models/item');

// Returns detail of a specific item
exports.get_item_details = (req, res, next) => {
  Item.findById(req.params.id)
    .exec((err, item) => {
      if (err) return res.json({ msg: 'There was an error getting items' });
      if (!item) return res.json({ msg: 'No such item exists' });
      Object.entries(item).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          item.populate(key);
        }
        if (value == 'material' && key != '') {
          item.populate(key);
        }
      });
      return res.json({ item });
    });
};

// Returns list of ll items
exports.get_item_list = (req, res, next) => {
  Item.find()
    .exec((err, items) => {
      if (err) return res.json({ msg: 'There was an error getting items' });
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
    .isInt({ min: 1, max: 18 })
    .withMessage('Level must be between 1 and 18')
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
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
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
      if (err) return res.json({ err, msg: 'Failed to save changes' });
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
    .isInt({ min: 1, max: 18 })
    .withMessage('Level must be between 1 and 18')
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
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        data: req.body,
        errors: errors.array(),
      });
    }

    Item.findById(req.body.id)
      .exec((err, item) => {
        if (err) return res.json({ msg: 'There was an error' });
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
      if (err) return res.json({ msg: 'There was an error' });
      if (!item) return res.json({ msg: 'No such item exists' });
      item.remove((err) => {
        if (err) return res.json({ msg: 'Failed to remove this item' });
        return res.json({ msg: 'Sucesfully removed item' });
      });
    });
};
