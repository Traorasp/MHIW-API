const mongoose = require('mongoose');

const { Schema } = mongoose;

const materialSchema = new Schema({
  name: { type: String, require: true, minLength: 1 },
  description: { type: String, require: true, minLength: 1 },
  image: { type: Schema.Types.ObjectId },
  effects: [{ type: Schema.Types.ObjectId, ref: 'Effect' }],
});

module.exports = mongoose.model('Material', materialSchema);
