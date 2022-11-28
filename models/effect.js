const mongoose = require('mongoose');

const { Schema } = mongoose;

const effectSchema = new Schema({
  name: { type: String, require: true, minLength: 1 },
  show: { type: Boolean, require: true },
  damageType: { type: String },
  damage: { type: Number },
  training: { type: String },
  stat: { type: String },
  property: { type: String },
  effect: { type: String },
  duration: { type: Number, require: true, min: 1 },
});

module.exports = mongoose.model('Effect', effectSchema);
