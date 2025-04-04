const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String, required: true, minLength: 1, maxLength: 20,
  },
  password: { type: String, required: true, minLength: 6 },
  admin: { type: Boolean, required: true },
  profilePic: { type: Schema.Types.ObjectId, ref: 'Images.file' },
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  friendRequests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('User', UserSchema);
