const mongoose = require('mongoose');

const { Schema } = mongoose;

const MagicSchema = new Schema({
  name: { type: String, require: true, minLength: 1 },
  description: { type: String, require: true, minLength: 1 },
});

module.exports = mongoose.model('Magic', MagicSchema);
