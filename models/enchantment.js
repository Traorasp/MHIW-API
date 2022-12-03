const mongoose = require('mongoose');

const { Schema } = mongoose;

const EnchantmentSchema = new Schema({
  level: {
    type: Number, require: true, min: 1, max: 18,
  },
  amount: {
    type: Number, require: true, min: 1, max: 8,
  },
  skill: { type: Schema.Types.ObjectId, ref: 'Skill' },
  spell: { type: Schema.Types.ObjectId, ref: 'Spell' },
});

// WIP finish when skill and spell models are complete
EnchantmentSchema.virtual('base').get(() => 'WIP');

module.exports = mongoose.model('Enchantment', EnchantmentSchema);
