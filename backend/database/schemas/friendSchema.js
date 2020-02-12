const { Schema } = require('mongoose');

const FriendSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    }
});

module.exports = FriendSchema;