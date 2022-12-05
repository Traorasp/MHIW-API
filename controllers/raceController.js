const { body, validationResult } = require('express-validator');
const Race = require('../models/race');
const Character = require('../models/character');

// Returns details of a cerrtain race
exports.get_race_details = (req, res, next) => {
  Race.findById(req.params.id)
    .exec((err, race) => {
      if (err) return res.json({ msg: 'There was an error getting race' });
      if (!race) return res.json({ msg: 'No such race exists' });
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
      if (err) return res.json({ msg: 'There was an error getting races' });
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
      return res.json({
        data: req.body, errors: errors.array(),
      });
    }
    Race.findOne({
      name: req.body.name,
      parent: req.body.name,
    })
      .exec((err, replica) => {
        if (err) return next(err);
        if (!replica) {
          const race = new Race({});
          Object.keys(req.body).forEach((key) => {
            if (req.body[key] != undefined && req.body[key] != []) {
              race[key] = req.body[key];
            }
          });
          race.save((err) => {
            if (err) {
              return next(err);
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
      return res.json({
        data: req.body, errors: errors.array(),
      });
    }
    Race.findOne({
      name: req.body.name,
      parent: req.body.name,
    })
      .exec((err, replica) => {
        if (err) return next(err);
        if (!replica || replica.id == req.body.id) {
          const data = {};
          Object.keys(req.body).forEach((key) => {
            if (req.body[key] != undefined && key !== 'id') {
              data[key] = req.body[key];
            }
          });
          Race.findByIdAndUpdate(req.body.id, data, (err, race) => {
            if (err) {
              return next(err);
            }
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
  Character.findOne({ race: req.params.id })
    .exec((err, char) => {
      if (err) return next(err);
      if (!char) {
        Race.findByIdAndDelete(req.params.id, (err) => {
          if (err) return res.json({ msg: 'Error deleting race' });
          return res.json({ msg: 'Succesfully removed race' });
        });
      } else {
        return res.json({ msg: 'There are still characters with the race' });
      }
    });
};
