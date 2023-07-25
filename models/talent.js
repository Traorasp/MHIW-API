const mongoose = require('mongoose');

const { Schema } = mongoose;

const TalentSchema = new Schema({
  name: { type: String, require: true, minLength: 1 },
  talent: { type: String, require: true, minLength: 1 },
  parent: [{ type: Schema.Types.ObjectId, ref: 'Talent' }],
  priority: { type: String, require: true, minLength: 1 },
  measurements: [{ type: String, require: true, minLength: 0 }],
  castTime: { type: Number, min: 0 },
  duration: { type: Number, require: true, min: 0 },
  cooldown: { type: Number, min: 0 },
  charges: { type: Number, min: 0 },
  description: { type: String, require: true, minLength: 1 },
});

module.exports = mongoose.model('Talent', TalentSchema);
