const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type: String, required: true, minLength: 1, maxLength: 20},
    password: {type: String, required: true, minLength: 6},
    characters: [ Schema.Types.ObjectId],
    profilePic: {data: Buffer, contentType: String}
});

// Virtual for user's URL
UserSchema.virtual('url').get(function() {
    return `/catalog/user/${this._id}`;
});

module.exports = mongoose.model('User', UserSchema);