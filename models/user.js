const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String, required: true, minLength: 1, maxLength: 20,
  },
  password: { type: String, required: true, minLength: 6 },
  characters: [Schema.Types.ObjectId],
  profilePic: { type: Schema.Types.ObjectId, ref: 'images.files' },
  friends: [Schema.Types.ObjectId],
  friendRequests: [Schema.Types.ObjectId],
});

// Virtual for user's URL
UserSchema.virtual('url').get(function () {
  return `/catalog/user/${this._id}`;
});

module.exports = mongoose.model('User', UserSchema);
