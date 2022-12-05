const mongoose = require('mongoose');

const { Schema } = mongoose;

const TitleSchema = new Schema({
  name: { type: String, require: true, minLength: 1 },
  level: {
    type: Number, require: true, min: 1, max: 18,
  },
  description: { type: String, require: true, minLength: 1 },
  effects: { type: Schema.Types.ObjectId },
  skills: { type: Schema.Types.ObjectId },
});

module.exports = mongoose.model('Title', TitleSchema);
