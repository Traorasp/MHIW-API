const mongoose = require('mongoose');

const { Schema } = mongoose;

const RaceSchema = new Schema({
  name: { type: String, require: true, minLength: 1 },
  parent: { type: String, require: true, minLength: 1 },
  training: { type: Schema.Types.ObjectId, ref: 'Effect' },
  weakness: [{ type: String, minLength: 1 }],
  limit: { type: Number, require: true, min: 0 },
  baseStats: {
    health: { type: Number, require: true, min: 0 },
    defense: { type: Number, require: true, min: 0 },
    strength: { type: Number, require: true, min: 0 },
    speed: { type: Number, require: true, min: 0 },
    mana: { type: Number, require: true, min: 0 },
    accuracy: { type: Number, require: true, min: 0 },
    evasion: { type: Number, require: true, min: 0 },
    charisma: { type: Number, require: true, min: 0 },
    will: { type: Number, require: true, min: 0 },
    intimidation: { type: Number, require: true, min: 0 },
    hiding: { type: Number, require: true, min: 0 },
    tracking: { type: Number, require: true, min: 0 },
  },
  mainSkills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
  subSkills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
  description: { type: String, require: true, minLength: 1 },
});

module.exports = mongoose.model('Race', RaceSchema);
