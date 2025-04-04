const mongoose = require('mongoose');

const { Schema } = mongoose;

const ItemSchema = new Schema({
  name: { type: String, require: true, minLength: 1 },
  rarity: { type: String, require: true, minLength: 1 },
  image: { type: Schema.Types.ObjectId, ref: 'images.files' },
  level: {
    type: Number, required: true, min: 1, max: 15,
  },
  material: { type: Schema.Types.ObjectId, ref: 'Material' },
  subStats: [{ type: Schema.Types.ObjectId, ref: 'Effect' }],
  cost: { type: Number, min: 0 },
  type: { type: String, require: true, minLength: 1 },
  baseStats: {
    maxDurability: { type: Number, min: 0 },
    durability: { type: Number, min: 0 },
    defense: { type: Number, min: 0 },
    damage: { type: Number, min: 0 },
    weight: { type: Number, min: 0 },
  },
  enchantments: [{ type: Schema.Types.ObjectId, ref: 'Enchantment' }],
  description: { type: String },
  background: { type: String },
});

module.exports = mongoose.model('Item', ItemSchema);
