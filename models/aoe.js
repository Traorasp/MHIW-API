const mongoose = require('mongoose');

const { Schema } = mongoose;

const aoeSchema = new Schema({
  name: { type: String, require: true, minLength: 1 },
  fixed: { type: Boolean, require: true },
  range: { type: Number, require: true, min: 1 },
});

module.exports = mongoose.model('AOE', aoeSchema);
