const mongoose = require('mongoose');

const { Schema } = mongoose;

const EnchantmentSchema = new Schema({
  amount: {
    type: Number, require: true, min: 1, max: 8,
  },
  skill: { type: Schema.Types.ObjectId, ref: 'Skill' },
  spell: { type: Schema.Types.ObjectId, ref: 'Spell' },
});

module.exports = mongoose.model('Enchantment', EnchantmentSchema);
