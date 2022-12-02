const mongoose = require('mongoose');

const { Schema } = mongoose;

const ItemSchema = new Schema({
  name: { type: String, require: true, minLength: 1 },
  rarity: { type: String, require: true, minLength: 1 },
  image: { type: Schema.Types.ObjectId, ref: 'images.files' },
  level: {
    type: Number, required: true, min: 1, max: 18,
  },
  material: { type: Schema.Types.ObjectId, ref: 'Material' },
  subStat: [{ type: Schema.Types.ObjectId, ref: 'Effect' }],
  cost: { type: Number, min: 1 },
  type: { type: String, require: true, minLength: 1 },
  baseStats: {
    maxDurability: { type: Number, min: 0 },
    durability: { type: Number, min: 0 },
    defense: { type: Number, min: 0 },
    damage: { type: Number, min: 0 },
    weight: { type: Number, min: 0 },
  },
  skills: [{ type: Schema.Types.ObjectId, ref: 'Enchantment' }],
  description: { type: String },
  background: { type: String },
});

// Gets buffs from items, skills and status to get percentage increase to stats
// also gets value of stats that can only increase from items and skills
ItemSchema.virtual('realStats').get(() => 'WIP');

module.exports = mongoose.model('Item', ItemSchema);
