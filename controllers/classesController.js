const { body, validationResult } = require('express-validator');
const Classes = require('../models/classes');
const Character = require('../models/character');

// Returns details of a cerrtain classes
exports.get_class_details = (req, res, next) => {
  Classes.findById(req.params.id)
    .exec((err, classes) => {
      if (err) return res.status(404).json({ err, msg: 'Error retrieving class' });
      if (!classes) return res.status(404).json({ err, msg: 'Class does not exist' });
      const promises = [];
      Object.entries(classes._doc).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          promises.push(classes.populate(key));
        }
      });
      return Promise.all(promises).then(() => res.json({ classes }));
    });
};

// Returns list of all classes
exports.get_class_list = (req, res, next) => {
  Classes.find()
    .exec((err, classes) => {
      if (err) return res.status(404).json({ err, msg: 'Error retrieving class' });
      return res.json({ classes });
    });
};

// Creates new classes and saves it in database, returns new classes
exports.post_class = [
  body('name', 'Class must have name.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('requirements', 'Class must have a requirement')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('type', 'Class must have a type')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'Class must have a description')
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
    Classes.findOne({
      name: req.body.name,
      type: req.body.type,
      requirements: req.body.requirements,
      description: req.body.description,
    })
      .exec((err, replica) => {
        if (err) return res.status(404).json({ err, msg: 'Error retrieving replica' });
        if (!replica) {
          const classes = new Classes({});
          Object.keys(req.body).forEach((key) => {
            if (req.body[key] != undefined && req.body[key] != []) {
              classes[key] = req.body[key];
            }
          });
          classes.save((err) => {
            if (err) return res.status(404).json({ err, msg: 'Failed to save class' });
            return res.json({ classes, msg: 'Class succesfully created' });
          });
        } else {
          return res.json({ replica, msg: 'Class already exists' });
        }
      });
  },
];

// Update an existing classes, returns updated classes
exports.post_update_class = [
  body('name', 'Class must have name.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('requirements', 'Class must have a requirement')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('type', 'Class must have a type')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'Class must have a description')
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
    Classes.findOne({
      name: req.body.name,
      type: req.body.type,
      requirements: req.body.requirements,
      description: req.body.name,
    })
      .exec((err, replica) => {
        if (err) return res.status(404).json({ err, msg: 'Error retrieving class' });
        if (!replica || replica.id == req.body._id) {
          const data = {};
          Object.keys(req.body).forEach((key) => {
            if (req.body[key] != undefined && req.body[key] != []) {
              data[key] = req.body[key];
            }
          });
          Classes.findByIdAndUpdate(req.body._id, data, (err, classes) => {
            if (err) return res.status(404).json({ err, msg: 'Failed to save class' });
            return res.json({ classes, msg: 'Class succesfully updated' });
          });
        } else {
          return res.json({ replica, msg: 'Class already exists' });
        }
      });
  },
];
// Deletes a certain classes
exports.delete_class = (req, res, next) => {
  Character.findOne({ class: req.params.id })
    .exec((err, char) => {
      if (err) return res.status(404).json({ err, msg: 'Error retrieving class' });
      if (!char) {
        Classes.findByIdAndDelete(req.params.id, (err) => {
          if (err) return res.status(404).json({ err, msg: 'Failed to remove class' });
          return res.json({ msg: 'Succesfully removed class' });
        });
      } else {
        return res.json({ msg: 'There are still characters with the class' });
      }
    });
};
