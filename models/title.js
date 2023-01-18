const mongoose = require('mongoose');

const { Schema } = mongoose;

const TitleSchema = new Schema({
  name: { type: String, require: true, minLength: 1 },
  level: {
    type: Number, require: true, min: 1, max: 15,
  },
  description: { type: String, require: true, minLength: 1 },
  effects: { type: Schema.Types.ObjectId, ref: 'Effect' },
  skills: { type: Schema.Types.ObjectId, ref: 'Skill' },
});

module.exports = mongoose.model('Title', TitleSchema);
