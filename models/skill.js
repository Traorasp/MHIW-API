const mongoose = require('mongoose');

const { Schema } = mongoose;

const SkillSchema = new Schema({
  name: { type: String, require: true, minLength: 1 },
  type: { type: String, require: true, minLength: 1 },
  priority: { type: String, require: true, minLength: 1 },
  cooldown: { type: Number, min: 1 },
  duration: { type: Number, require: true, min: 0 },
  stat: { type: String, minLength: 1 },
  roll: { type: Number, min: 0 },
  range: { type: Number, min: 1 },
  aoe: [{ type: Schema.Types.ObjectId, ref: 'AOE' }],
  effects: [{ type: Schema.Types.ObjectId, ref: 'Effect' }],
  description: { type: String, require: true, minLength: 1 },
});

module.exports = mongoose.model('Skill', SkillSchema);
