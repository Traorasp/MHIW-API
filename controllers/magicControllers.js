const { body, validationResult } = require('express-validator');
const Magic = require('../models/magic');
const Spell = require('../models/spell');

// Returns details of a cerrtain magic
exports.get_magic_details = (req, res, next) => {
  Magic.findById(req.params.id)
    .populate('spells')
    .exec((err, magic) => {
      if (err) return res.json({ msg: 'There was an error getting magic' });
      if (!magic) return res.json({ msg: 'No such magic exists' });
      return res.json({ magic });
    });
};

// Returns list of all magics
exports.get_magic_list = (req, res, next) => {
  Magic.find()
    .exec((err, magics) => {
      if (err) return res.json({ msg: 'There was an error getting magics' });
      return res.json({ magics });
    });
};

// Creates new spell and saves it in database, returns new spell
exports.post_magic = [
  body('name', 'Spell must have name.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', '')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        data: req.body, errors: errors.array(),
      });
    }
    Magic.findOne({
      name: req.body.name,
      description: req.body.description,
    })
      .exec((err, replica) => {
        if (err) return next(err);
        if (!replica) {
          const magic = new Magic({});
          Object.keys(req.body).forEach((key) => {
            if (req.body[key] != undefined && req.body[key] != []) {
              magic[key] = req.body[key];
            }
          });
          magic.save((err) => {
            if (err) {
              return next(err);
            }
            return res.json({ magic, msg: 'Magic succesfully created' });
          });
        } else {
          return res.json({ replica, msg: 'Magic already exists' });
        }
      });
  },
];

// Update an existing spell, returns updated spell
exports.post_update_magic = [
  body('name', 'Spell must have name.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', '')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        data: req.body, errors: errors.array(),
      });
    }

    Magic.findOne({
      name: req.body.name,
      description: req.body.description,
      spells: req.body.spells,
    })
      .exec((err, replica) => {
        if (err) return next(err);
        if (!replica) {
          Magic.findById(req.body.id)
            .exec((err, magic) => {
              if (err) return next(err);
              if (!magic) return res.json({ msg: 'No such magic exists' });

              Object.keys(req.body).forEach((key) => {
                if (req.body[key] != undefined && req.body[key] != []) {
                  magic[key] = req.body[key];
                }
              });
              magic.save((err) => {
                if (err) {
                  return next(err);
                }
                return res.json({ magic, msg: 'Magic succesfully updated' });
              });
            });
        } else {
          return res.json({ replica, msg: 'Magic already exists' });
        }
      });
  },
];

// Deletes a certain spell
exports.delete_magic = (req, res, next) => {
  Magic.findById(req.params.id)
    .exec((err, magic) => {
      if (err) return next(err);
      if (!magic) return res.json({ msg: 'No such magic exists' });
      if (magic.spells.length < 1) {
        Magic.findByIdAndDelete(req.params.id, (err) => {
          if (err) return res.json({ msg: 'Error deleting magic' });
          return res.json({ msg: 'Succesfully deletd magic' });
        });
      } else { return res.json({ msg: 'Magic still contains spells' }); }
    });
};
