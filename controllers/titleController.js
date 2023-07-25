const { body, validationResult } = require('express-validator');
const Title = require('../models/title');
const Character = require('../models/character');
const { handleDeletion } = require('./handleDeletion');

// Returns details of a cerrtain title
exports.get_title_details = (req, res, next) => {
  Title.findById(req.params.id)
    .exec((err, title) => {
      if (err) return res.status(404).json({ err, msg: 'Error retrieving title' });
      if (!title) return res.status(404).json({ err, msg: 'Title does not exist' });
      const promises = [];
      Object.entries(title._doc).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          promises.push(title.populate(key));
        }
      });
      return Promise.all(promises).then(() => res.json({ title }));
    });
};

// Returns list of all titles
exports.get_title_list = (req, res, next) => {
  Title.find()
    .exec((err, titles) => {
      if (err) return res.status(404).json({ err, msg: 'Error retrieving titles' });
      return res.json({ titles });
    });
};

// Creates new title and saves it in database, returns new title
exports.post_title = [
  body('name', 'Title must have name.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('level', 'Title must have a level')
    .trim()
    .isInt({ min: 1, max: 15 })
    .withMessage('Level must be within 1 and 15')
    .escape(),
  body('description', 'Title must have a description')
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
    Title.findOne({
      name: req.body.name,
      level: req.body.level,
      description: req.body.description,
    })
      .exec((err, replica) => {
        if (err) return res.status(404).json({ err, msg: 'Error retrieving replica' });
        if (!replica) {
          const title = new Title({});
          Object.keys(req.body).forEach((key) => {
            if (req.body[key] != undefined && req.body[key] != []) {
              title[key] = req.body[key];
            }
          });
          title.save((err) => {
            if (err) return res.status(404).json({ err, msg: 'Failed to save title' });
            return res.json({ title, msg: 'Title succesfully created' });
          });
        } else {
          return res.json({ replica, msg: 'Title already exists' });
        }
      });
  },
];

// Update an existing title, returns updated title
exports.post_update_title = [
  body('name', 'Title must have name.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('level', 'Title must have a level')
    .trim()
    .isInt({ min: 1, max: 15 })
    .withMessage('Level must be within 1 and 15')
    .escape(),
  body('description', 'Title must have a description')
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
    Title.findOne({
      name: req.body.name,
      level: req.body.level,
      description: req.body.name,
    })
      .exec((err, replica) => {
        if (err) return res.status(404).json({ err, msg: 'Error retrieving title' });
        if (!replica || replica.id == req.body._id) {
          const data = {};
          Object.keys(req.body).forEach((key) => {
            if (req.body[key] != undefined && req.body[key] != []) {
              data[key] = req.body[key];
            }
          });
          Title.findByIdAndUpdate(req.body._id, data, (err, title) => {
            if (err) return res.status(404).json({ err, msg: 'Failed to save title' });
            return res.json({ title, msg: 'Title succesfully updated' });
          });
        } else {
          return res.json({ replica, msg: 'Title already exists' });
        }
      });
  },
];
// Deletes a certain title
exports.delete_title = (req, res, next) => {
  Character.find({ titles: req.params.id })
    .exec((err, results) => {
      if (err) return res.status(404).json({ err, msg: 'Error retrieving title' });
      return handleDeletion({ character: results }, 'Title', res, req.params.id);
    });
};
