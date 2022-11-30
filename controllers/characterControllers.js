const { body, validationResult } = require('express-validator');
const { default: mongoose } = require('mongoose');
const Character = require('../models/character');
const upload = require('../config.js/upload');

// Get detailed info of one character
// Only populates fields that aren't empty
exports.get_character = (req, res, next) => {
  Character.findById(req.params.id)
    .exec((err, char) => {
      if (!char) next(err);
      Object.entries(char).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          char.populate(key);
        }
        if (value == 'race' && key != '') {
          char.populate(key);
        }
      });
      return res.json(char);
    });
};

// Get character icon or image
exports.get_character_image = (req, res, next) => {
  const _id = new mongoose.Types.ObjectId(req.params.id);
  req.app.locals.gfs.find({ _id }).toArray((err, image) => {
    if (!image) {
      return res.status(400).json({ msg: 'No profile exists' });
    }
    return req.app.locals.gfs.openDownloadStream(_id).pipe(res);
  });
};

// Get basic info of all users characters
exports.get_character_list = (req, res, next) => {
  Character.find({ owner: req.body.id })
    .exec((err, characters) => {
      if (!characters) return res.json({ msg: 'Chracters don\'t exist' });
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
      if (err) { return next(err); }
      return res.json(char);
    });
  }];

// Allows user to update character details
exports.post_update_character = [
  upload.fields([{ name: 'char', maxcount: 1 }, { name: 'icon', maxcount: 1 }]),
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
    .custom((raceSkills) => {
      const totalLV = 0;
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
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ data: req.body, errors: errors.array() });
    }
    Character.findById(req.body.id)
      .exec((err, char) => {
        if (err) return next(err);
        if (!char) return res.json({ msg: 'Character doesn\'t exist' });
        if (char.owner != req.body.owner) return res.json({ msg: 'User doesn\'t own this character' });

        req.app.locals.gfs.delete(char.charImage, () => {});
        req.app.locals.gfs.delete(char.charIcon, () => {});

        for (const [key, value] of Object.entries(req.body)) {
          if (req.body[key] != undefined && req.body[key] != []) {
            char[key] = req.body[key];
          }
        }
        if (req.files) {
          char.charImage = req.files.char[0].id;
          char.charIcon = req.files.icon[0].id;
        }

        char.save((err) => {
          if (err) return res.json({ err, msg: 'Failed to save changes' });
          return res.json({ msg: 'Sucesfully updated character', char });
        });
      });
  },
];

// Deletes a specific character
exports.delete_character = (req, res, next) => {
  Character.findById(req.params.id)
    .exec((err, char) => {
      if (err) return next(err);
      if (!char) return res.json({ msg: 'Character doesn\'t exist' });
      if (char.owner != req.body.owner) {
        return res.json({ msg: 'User doesn\'t own this character' });
      }
      char.remove((err) => {
        if (err) return res.json({ msg: 'Failed to remove this character' });
        return res.json({ msg: 'Sucesfully removed character' });
      });
    });
};
