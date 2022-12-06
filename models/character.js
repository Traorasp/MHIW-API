const mongoose = require('mongoose');

const { Schema } = mongoose;

const CharacterSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, require: true, ref: 'User' },
  firstName: {
    type: String, require: true, minLength: 1, maxLength: 20,
  },
  lastName: {
    type: String, require: true, minLength: 1, maxLength: 20,
  },
  charImage: { type: Schema.Types.ObjectId, ref: 'images.files' },
  charIcon: { type: Schema.Types.ObjectId, ref: 'images.files' },
  age: { type: Number, min: 1 },
  nationality: { type: String },
  raceSkills: [{ type: Number }],
  race: { type: Schema.Types.ObjectId, ref: 'Race' },
  gender: { type: String },
  level: {
    type: Number, required: true, min: 1, max: 18,
  },
  titles: [{ type: Schema.Types.ObjectId, ref: 'Title' }],
  magics: [{ type: Schema.Types.ObjectId, ref: 'Magic' }],
  talents: [{ type: Schema.Types.ObjectId, ref: 'Talent' }],
  unique: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
  baseStats: {
    maxHealth: { type: Number, min: 0 },
    currHealth: { type: Number, min: 0 },
    defense: { type: Number, min: 0 },
    strength: { type: Number, min: 0 },
    speed: { type: Number, min: 0 },
    mana: { type: Number, min: 0 },
    accuracy: { type: Number, min: 0 },
    evasion: { type: Number, min: 0 },
    charisma: { type: Number, min: 0 },
    will: { type: Number, min: 0 },
    intimidation: { type: Number, min: 0 },
    hiding: { type: Number, min: 0 },
    tracking: { type: Number, min: 0 },
  },
  status: [{ type: Schema.Types.ObjectId, ref: 'Effect' }],
  skills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
  traits: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
  class: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
  inventory: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
  description: { type: String },
  background: { type: String },
});

// Gets training buffs from all skills and items
CharacterSchema.virtual('training').get(() => 'WIP');
// Gets buffs from items, skills and status to get percentage increase to stats
// also gets value of stats that can only increase from items and skills
CharacterSchema.virtual('realStats').get(() => 'WIP');

module.exports = mongoose.model('Character', CharacterSchema);
