const mongoose = require('mongoose');
const FriendSchema = require('./../schemas/friendSchema');

const FriendModel = mongoose.model('friend', FriendSchema);

module.exports = FriendModel;