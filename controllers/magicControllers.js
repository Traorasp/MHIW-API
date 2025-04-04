const { body, validationResult } = require('express-validator');
const async = require('async');
const Magic = require('../models/magic');
const Character = require('../models/character');
const Spell = require('../models/spell');
const { handleDeletion } = require('./handleDeletion');

// Returns details of a cerrtain magic
exports.get_magic_details = (req, res, next) => {
  Magic.findById(req.params.id)
    .exec((err, magic) => {
      if (err) return res.status(404).json({ err, msg: 'Error retrieving magic' });
      if (!magic) return res.status(404).json({ err, msg: 'Magic does not exists' });
      return res.json({ magic });
    });
};

// Returns list of all magics
exports.get_magic_list = (req, res, next) => {
  Magic.find()
    .exec((err, magics) => {
      if (err) return res.status(404).json({ err, msg: 'Error retrieving magics' });
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
      return res.status(404).json({
        data: req.body, errors: errors.array(),
      });
    }
    Magic.findOne({
      name: req.body.name,
      description: req.body.description,
    })
      .exec((err, replica) => {
        if (err) return res.status(404).json({ err, msg: 'Error retrieving replica' });
        if (!replica) {
          const magic = new Magic({});
          Object.keys(req.body).forEach((key) => {
            if (req.body[key] != undefined && req.body[key] != []) {
              magic[key] = req.body[key];
            }
          });
          magic.save((err) => {
            if (err) return res.status(404).json({ err, msg: 'Failed to save magic' });

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
      return res.status(404).json({
        data: req.body, errors: errors.array(),
      });
    }

    Magic.findOne({
      name: req.body.name,
      description: req.body.description,
    })
      .exec((err, replica) => {
        if (err) return res.status(404).json({ err, msg: 'Erro retrieving replica' });
        if (!replica || replica.id == req.body._id) {
          Magic.findById(req.body._id)
            .exec((err, magic) => {
              if (err) return res.status(404).json({ err, msg: 'Error retrieving magic' });
              if (!magic) return res.status(404).json({ err, msg: 'Magic does not exists' });

              Object.keys(req.body).forEach((key) => {
                if (req.body[key] != undefined && req.body[key] != []) {
                  magic[key] = req.body[key];
                }
              });
              magic.save((err) => {
                if (err) return res.status(404).json({ err, msg: 'Failed to save magic' });
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
  async.parallel({
    spell(callback) {
      Spell.find({ magics: req.params.id })
        .exec(callback);
    },
    character(callback) {
      Character.find({ magics: req.params.id })
        .exec(callback);
    },
  }, (err, results) => {
    if (err) return res.status(404).json({ err, msg: 'Error retrieving results' });
    return handleDeletion(results, 'Magic', res, req.params.id);
  });
};
