const mongoose = require('mongoose');

const { Schema } = mongoose;

const TalentSchema = new Schema({
  name: { type: String, require: true, minLength: 1 },
  parent: { type: String, require: true, minLength: 1 },
  priority: { type: String, require: true, minLength: 1 },
  measurements: [{ type: String, require: true, minLength: 3 }],
  castTime: { type: Number, min: 1 },
  duration: { type: Number, require: true, min: 0 },
  cooldown: { type: Number, min: 1 },
  charges: { type: Number, min: 2 },
  description: { type: String, require: true, minLength: 1 },
});

module.exports = mongoose.model('Talent', TalentSchema);
