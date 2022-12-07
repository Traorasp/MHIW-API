const { body, validationResult } = require('express-validator');
const Character = require('../models/character');

// Get detailed info of one character
// Only populates fields that aren't empty
exports.get_character = (req, res, next) => {
  Character.findById(req.params.id)
    .exec((err, char) => {
      if (err) return res.status(404).json({ err, msg: 'Error retrieving charcater' });
      if (!char) return res.status(404).json({ err, msg: 'Character does not exist' });
      const promises = [];
      Object.entries(char._doc).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          promises.push(char.populate(key));
        } else if (value === 'race' && key !== '') {
          promises.push(char.populate(key));
        }
      });
      return Promise.all(promises).then(() => res.json({ char }));
    });
};

// Get basic info of all users characters
exports.get_character_list = (req, res, next) => {
  Character.find({ owner: req.body.id })
    .exec((err, characters) => {
      if (err) return res.status(404).json({ err, msg: 'Error retrieving characters' });
      return res.json(characters);
    });
};
// Creates a characters basic details with starter stats
exports.post_create_character = [
  body('firstName', 'Character must have a first name')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('lastName', 'Character must have a last name')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('level', 'Character must have a level')
    .trim()
    .isInt({ min: 1, max: 18 })
    .withMessage('Level must be an integer between 1 and 18')
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({
        data: req.body,
        errors: errors.array(),
      });
    }
    const char = new Character({
      owner: req.body.id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      level: req.body.level,
    });
    char.save((err) => {
      if (err) return res.status(404).json({ err, msg: 'Failed to save character' });
      return res.json(char);
    });
  }];

// Allows user to update character details
exports.post_update_character = [
  body('firstName', 'Character must have a first name')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('lastName', 'Character must have a last name')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('level', 'Character must have a level')
    .trim()
    .isInt({ min: 1, max: 18 })
    .withMessage('Level must be an integer between 1 and 18')
    .escape(),
  body('raceSkill', '')
    .optional({ checkFalsy: true })
    .custom((raceSkills, { req }) => {
      let totalLV = 0;
      Object.values(raceSkills).forEach((level) => {
        totalLV += level;
      });
      if (totalLV > req.body.level) {
        throw new Error('Race skill level cannot be higher than level');
      } else {
        return true;
      }
    }),
  body('age', 'Character must have a positive age')
    .trim()
    .optional({ checkFalsy: true })
    .isInt({ min: 0 })
    .escape(),
  body('nationality', '')
    .trim()
    .optional({ checkFalsy: true })
    .escape(),
  body('gender', '')
    .trim()
    .optional({ checkFalsy: true })
    .escape(),
  body('description', '')
    .trim()
    .optional({ checkFalsy: true })
    .escape(),
  body('background', '')
    .trim()
    .optional({ checkFalsy: true })
    .escape(),
  body('baseStats.*', '')
    .trim()
    .optional({ checkFalsy: true })
    .isInt({ min: 0 })
    .withMessage('Base stat must be a positive number')
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ data: req.body, errors: errors.array() });
    }
    Character.findById(req.body.id)
      .exec((err, char) => {
        if (err) return res.status(404).json({ err, msg: 'Error retrieving character' });
        if (!char) return res.status(404).json({ err, msg: 'Character does not exist' });
        if (char.owner != req.body.owner) return res.status(403).json({ err, msg: 'User does not own this character' });
        Object.keys(req.body).forEach((key) => {
          if (req.body[key] != undefined && req.body[key] != []) {
            char[key] = req.body[key];
          }
        });

        char.save((err) => {
          if (err) return res.status(404).json({ err, msg: 'Failed to save changes' });
          return res.json({ msg: 'Sucesfully updated character', char });
        });
      });
  },
];

// Deletes a specific character
exports.delete_character = (req, res, next) => {
  Character.findById(req.params.id)
    .exec((err, char) => {
      if (err) return res.status(404).json({ err, msg: 'Error retrieving characters' });
      if (!char) return res.status(404).json({ err, msg: 'Character does not exist' });
      if (char.owner != req.body.owner) {
        return res.status(403).json({ err, msg: 'User does not own this character' });
      }
      char.remove((err) => {
        if (err) return res.status(404).json({ err, msg: 'Failed to remove this character' });
        return res.json({ msg: 'Sucesfully removed character' });
      });
    });
};
