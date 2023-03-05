const mongoose = require('mongoose');

const { Schema } = mongoose;

const ClassesSchema = new Schema({
  name: { type: String, require: true, minLength: 1 },
  requirements: { type: String, require: true, minLength: 1 },
  type: { type: String, require: true, minLength: 1 },
  effects: [{ type: Schema.Types.ObjectId, ref: 'Effect' }],
  skills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
  description: { type: String, require: true, minLength: 1 },
});

module.exports = mongoose.model('Classes', ClassesSchema);
