const { body, validationResult } = require('express-validator');
const Race = require('../models/race');
const Character = require('../models/character');
const { handleDeletion } = require('./handleDeletion');

// Returns details of a cerrtain race
exports.get_race_details = (req, res, next) => {
  Race.findById(req.params.id)
    .exec((err, race) => {
      if (err) return res.status(404).json({ err, msg: 'Error retrieving race' });
      if (!race) return res.status(404).json({ err, msg: 'Race does not exists' });
      const promises = [];
      Object.entries(race._doc).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          promises.push(race.populate(key));
        }
      });
      return Promise.all(promises).then(() => res.json({ race }));
    });
};

// Returns list of all races
exports.get_race_list = (req, res, next) => {
  Race.find()
    .exec((err, races) => {
      if (err) return res.status(404).json({ err, msg: 'Error retrieving races' });
      return res.json({ races });
    });
};

// Creates new race and saves it in database, returns new race
exports.post_race = [
  body('name', 'Race must have name.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('parent', 'Race must have a parent')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('weakness.*', '')
    .trim()
    .optional({ checkFalsy: true })
    .isLength({ min: 1 })
    .escape(),
  body('limit', 'Race must have a limit')
    .trim()
    .isInt({ min: 0 })
    .withMessage('Limit must be a positive number')
    .escape(),
  body('baseStats.*', 'Race must have all stats')
    .trim()
    .isInt({ min: 0 })
    .withMessage('Stat must be a positive number')
    .escape(),
  body('description', 'Race must have a description')
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
    Race.findOne({
      name: req.body.name,
      parent: req.body.name,
    })
      .exec((err, replica) => {
        if (err) return res.status(404).json({ err, msg: 'Error retrieving replica' });
        if (!replica) {
          const race = new Race({});
          race.name = req.body.name;
          Object.keys(req.body).forEach((key) => {
            if (req.body[key] != undefined && req.body[key] != '' && req.body[key] != [] && key !== 'name') {
              race[key] = req.body[key];
            }
          });
          race.save((err) => {
            if (err) {
              return res.status(404).json({ err, msg: 'Failed to save race' });
            }
            return res.json({ race, msg: 'Race succesfully created' });
          });
        } else {
          return res.json({ replica, msg: 'Race already exists' });
        }
      });
  },
];

// Update an existing race, returns updated race
exports.post_update_race = [
  body('name', 'Race must have name.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('parent', 'Race must have a parent')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('weakness*', '')
    .trim()
    .optional({ checkFalsy: true })
    .isLength({ min: 1 })
    .escape(),
  body('limit', 'Race must have a limit')
    .trim()
    .isInt({ min: 0 })
    .withMessage('Limit must be a positivee number')
    .escape(),
  body('baseStats.*', 'Race must have all stats')
    .trim()
    .isInt({ min: 0 })
    .withMessage('Stat must be a positive number')
    .escape(),
  body('description', 'Race must have a description')
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
    Race.findOne({
      name: req.body.name,
      parent: req.body.name,
    })
      .exec((err, replica) => {
        if (err) return res.status(404).json({ err, msg: 'Error retrieving replica' });
        if (!replica || replica.id == req.body._id) {
          const data = {};
          data.name = req.body.name;
          Object.keys(req.body).forEach((key) => {
            if (req.body[key] != undefined && key !== 'id' && key !== 'name') {
              data[key] = req.body[key];
            }
          });
          Race.findByIdAndUpdate(req.body._id, data, (err, race) => {
            if (err) return res.status(404).json({ err, msg: 'Failed to sae race' });
            return res.json({ race, msg: 'Race succesfully updated' });
          });
        } else {
          return res.json({ replica, msg: 'Race already exists' });
        }
      });
  },
];

// Deletes a certain race
exports.delete_race = (req, res, next) => {
  Character.find({ race: req.params.id })
    .exec((err, results) => {
      if (err) return res.status(404).json({ err, msg: 'Error retrieving character' });
      return handleDeletion({ character: results }, 'Race', res, req.params.id);
    });
};
