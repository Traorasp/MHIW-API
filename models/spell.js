const mongoose = require('mongoose');

const { Schema } = mongoose;

const SpellSchema = new Schema({
  name: { type: String, require: true, minLength: 1 },
  type: { type: String, require: true, minLength: 1 },
  requirements: [{ type: String, minLength: 1 }],
  damageType: [{ type: String, require: true, minLength: 1 }],
  damageRatio: {
    type: Number, min: 0, max: 5,
  },
  durabilityRatio: {
    type: Number, min: 0, max: 5,
  },
  knockbackRatio: {
    type: Number, min: 0, max: 5,
  },
  cost: { type: Number, required: true, min: 1 },
  range: { type: Number, required: true, min: 1 },
  aoe: [{ type: Schema.Types.ObjectId, ref: 'AOE' }],
  effects: [{ type: Schema.Types.ObjectId, ref: 'Effect' }],
  description: { type: String },
  charge: { type: Number, min: 1 },
  followUp: { type: Schema.Types.ObjectId, ref: 'Spell' },
});

module.exports = mongoose.model('Spell', SpellSchema);
