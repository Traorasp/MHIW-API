const { body, validationResult } = require('express-validator');
const async = require('async');
const Skill = require('../models/skill');
const Character = require('../models/character');
const Title = require('../models/title');
const Classes = require('../models/classes');
const Race = require('../models/race');
const Enchantment = require('../models/enchantment');
const { handleDeletion } = require('./handleDeletion');

// Returns details of a cerrtain skill
exports.get_skill_details = (req, res, next) => {
  Skill.findById(req.params.id)
    .exec((err, skill) => {
      if (err) return res.status(404).json({ err, msg: 'Error retrieving skill' });
      if (!skill) return res.status(404).json({ err, msg: 'Skill does not exist' });
      const promises = [];
      Object.entries(skill._doc).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          promises.push(skill.populate(key));
        }
      });
      return Promise.all(promises).then(() => res.json({ skill }));
    });
};

// Returns list of all skill
exports.get_skill_list = (req, res, next) => {
  Skill.find()
    .exec((err, skills) => {
      if (err) return res.status(404).json({ err, msg: 'Error retrieving skills' });
      return res.json({ skills });
    });
};

// Creates new skill and saves it in database, returns new skill
exports.post_skill = [
  body('name', 'Skill must have name.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('type', 'Skill must have a type specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('priority', 'Skill must have a priority.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('cooldown', 'Skill cooldown must be 1 or greater')
    .trim()
    .optional({ checkFalsy: true })
    .isFloat({ min: 1 })
    .escape(),
  body('duration', 'Skill must have a duration')
    .trim()
    .isInt({ min: 0 })
    .escape(),
  body('stat', '')
    .trim()
    .optional({ checkFalsy: true })
    .isLength({ min: 1 })
    .escape(),
  body('roll', 'Skill must have a positive roll')
    .trim()
    .optional({ checkFalsy: true })
    .isInt({ min: 0 })
    .escape(),
  body('range', 'Skill must have a positive range')
    .trim()
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .escape(),
  body('description', 'Skill must have a description')
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
    Skill.findOne(req.body)
      .exec((err, replica) => {
        if (err) return res.status(404).json({ err, msg: 'Error retrieving replica' });
        if (!replica) {
          const skill = new Skill({});
          Object.keys(req.body).forEach((key) => {
            if (req.body[key] != undefined && req.body[key] != []) {
              skill[key] = req.body[key];
            }
          });
          skill.save((err) => {
            if (err) return res.status(404).json({ err, msg: 'Failed to save skill' });
            return res.json({ skill, msg: 'Skill succesfully created' });
          });
        } else {
          return res.json({ replica, msg: 'Skill already exists' });
        }
      });
  },
];

// Update an existing skill, returns updated skill
exports.post_update_skill = [
  body('name', 'Skill must have name.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('type', 'Skill must have a type specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('priority', 'Skill must have a priority.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('cooldown', 'Skill cooldown must be 1 or greater')
    .trim()
    .optional({ checkFalsy: true })
    .isFloat({ min: 1 })
    .escape(),
  body('duration', 'Skill must have a duration')
    .trim()
    .isInt({ min: 0 })
    .escape(),
  body('stat', '')
    .trim()
    .optional({ checkFalsy: true })
    .isLength({ min: 1 })
    .escape(),
  body('roll', 'Skill must have a positive roll')
    .trim()
    .optional({ checkFalsy: true })
    .isInt({ min: 0 })
    .escape(),
  body('range', 'Skill must have a positive range')
    .trim()
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .escape(),
  body('description', 'Skill must have a description')
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
    Skill.findOne(req.body)
      .exec((err, replica) => {
        if (err) return res.status(404).json({ err, msg: 'Error retrieving skill' });
        if (!replica || replica.id == req.body._id) {
          const data = {};
          Object.keys(req.body).forEach((key) => {
            if (req.body[key] != undefined && req.body[key] != [] && key !== 'id') {
              data[key] = req.body[key];
            }
          });
          Skill.findByIdAndUpdate(req.body._id, data, (err, skill) => {
            if (err) return res.status(404).json({ err, msg: 'Failed to save skill' });
            return res.json({ skill, msg: 'Succesfully updated skill' });
          });
        } else {
          return res.json({ replica, msg: 'Skill already exists' });
        }
      });
  },
];

// Deletes a certain skill
exports.delete_skill = (req, res, next) => {
  async.parallel({
    character(callback) {
      Character.find({
        $or: [
          { skills: req.params.id },
          { traits: req.params.id },
          { unique: req.params.id },
        ],
      })
        .exec(callback);
    },
    classes(callback) {
      Classes.find({ skills: req.params.id })
        .exec(callback);
    },
    enchant(callback) {
      Enchantment.find({ skill: req.params.id })
        .exec(callback);
    },
    race(callback) {
      Race.find({
        $or: [
          { mainSkills: req.params.id },
          { subSkills: req.params.id },
        ],
      })
        .exec(callback);
    },
    title(callback) {
      Title.find({ skills: req.params.id })
        .exec(callback);
    },
  }, (err, results) => {
    if (err) return res.status(404).json({ err, msg: 'Error retrieving results' });
    return handleDeletion(results, 'Skill', res, req.params.id);
  });
};
