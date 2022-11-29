const { body, validationResult } = require('express-validator');
const { default: mongoose } = require('mongoose');
const Material = require('../models/material');
const upload = require('../config.js/upload');

// Returns detailed info of a material
exports.get_material_details = (req, res, next) => {
  Material.findById(req.params.id)
    .populate('effects')
    .exec((err, material) => {
      if (err) return next(err);
      if (!material) return res.json({ msg: 'Material doesn\'t exist' });
      return res.json({ material });
    });
};

// Returns image file of specified material
exports.get_material_image = (req, res, next) => {
  const _id = new mongoose.Types.ObjectId(req.params.id);
  req.app.locals.gfs.find({ _id }).toArray((err, image) => {
    if (!image) {
      return res.status(400).json({ msg: 'No profile exists' });
    }
    return req.app.locals.gfs.openDownloadStream(_id).pipe(res);
  });
};

// Returns a list of all materials
exports.get_material_list = (req, res, next) => {
  Material.find()
    .populate('effects')
    .exec((err, materials) => {
      if (err) return next(err);
      if (!materials) return res.json({ msg: 'Materials don\'t exist' });
      return res.json({ materials });
    });
};

// Creates a new material if it doesn't already exist else it returns old material
exports.post_material = [
  upload.single('material-img'),
  body('name', 'Material must have a name')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'Materia; must have a description')
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

    Material.findOne({
      name: req.body.name,
      description: req.body.description,
    })
      .exec((err, material) => {
        if (err) return next(err);
        if (!material) {
          const newMaterial = new Material({
            name: req.body.name,
            description: req.body.description,
            image: req.file.id,
            effects: req.body.effects,
          });
          newMaterial.save((err) => {
            if (err) {
              req.app.locals.gfs.delete(req.file.id, () => {});
              return next(err);
            }
            return res.json({ newMaterial, msg: 'Material succesfully created' });
          });
        } else {
          req.app.locals.gfs.delete(req.file.id, () => {});
          return res.json({ material, msg: 'Material already exists' });
        }
      });
  },
];

exports.post_update_material = [
  upload.single('material-img'),
  body('name', 'Material must have a name')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'Materia; must have a description')
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

    Material.findOne({
      name: req.body.name,
      description: req.body.description,
    })
      .exec((err, material) => {
        if (err) return next(err);
        if (!material) {
          const newMaterial = new Material({
            _id: req.body.id,
            name: req.body.name,
            description: req.body.description,
            image: req.file.id,
            effects: req.body.effects,
          });
          Material.findByIdAndUpdate(req.body.id, newMaterial, (err) => {
            if (err) {
              req.app.locals.gfs.delete(req.file.id, () => {});
              return next(err);
            }
            return res.json({ newMaterial, msg: 'Succesfully updated material' });
          });
        } else {
          req.app.locals.gfs.delete(req.file.id, () => {});
          return res.json({ material, msg: 'Material already exists' });
        }
      });
  },
];

// WIP COPLETE WHE ITEMS CONTROLLERS ARE COMPLETE
exports.delete_material = (req, res, next) => {

};
