const { body, validationResult } = require('express-validator');
const Material = require('../models/material');
const Item = require('../models/item');
const { handleDeletion } = require('./handleDeletion');

// Returns detailed info of a material
exports.get_material_details = (req, res, next) => {
  Material.findById(req.params.id)
    .populate('effects')
    .exec((err, material) => {
      if (err) return res.status(404).json({ err, msg: 'Error retrieving material' });
      if (!material) return res.status(404).json({ err, msg: 'Material does not exist' });
      return res.json({ material });
    });
};

// Returns a list of all materials
exports.get_material_list = (req, res, next) => {
  Material.find()
    .populate('effects')
    .exec((err, materials) => {
      if (err) return res.status(404).json({ err, msg: 'Error retrieving materials' });
      if (!materials) return res.status(404).json({ err, msg: 'Materials does not exist' });
      return res.json({ materials });
    });
};

// Creates a new material if it doesn't already exist else it returns old material
exports.post_material = [
  body('name', 'Material must have a name')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'Material must have a description')
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

    Material.findOne({
      name: req.body.name,
      description: req.body.description,
    })
      .exec((err, replica) => {
        if (err) return res.status(404).json({ err, msg: 'Error retrieving material' });
        if (!replica) {
          const material = new Material({
            name: req.body.name,
            description: req.body.description,
            image: req.body.file ? req.body.file : null,
            effects: req.body.effects,
          });
          material.save((err) => {
            if (err) {
              return res.status(404).json({ err, msg: 'Failed to save material' });
            }
            return res.json({ material, msg: 'Material succesfully created' });
          });
        } else {
          return res.json({ replica, msg: 'Material already exists' });
        }
      });
  },
];

exports.post_update_material = [
  body('name', 'Material must have a name')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'Material must have a description')
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

    Material.findOne({
      name: req.body.name,
      description: req.body.description,
    })
      .exec((err, replica) => {
        if (err) return res.status(404).json({ err, msg: 'Error retrieving replica' });
        if (!replica || replica.id == req.body._id) {
          const data = {
            name: req.body.name,
            description: req.body.description,
            image: req.body.file ? req.body.file : req.body.image ? req.body.image : null,
            effects: req.body.effects,
          };
          Material.findByIdAndUpdate(req.body._id, data, (err, material) => {
            if (err) return res.status(404).json({ err, msg: 'Failed to save material' });
            return res.json({ material, msg: 'Succesfully updated material' });
          });
        } else {
          return res.json({ replica, msg: 'Material already exists' });
        }
      });
  },
];

// deletes material if there are no references to it
exports.delete_material = (req, res, next) => {
  Item.find({ material: req.params.id })
    .exec((err, results) => {
      if (err) return res.status(404).json({ err, msg: 'Error retrieving item' });
      return handleDeletion({ item: results }, 'Material', res, req.params.id);
    });
};
