const FriendModel = require('./../database/models/friendModel');

function create(user) {
    try {
        const { name, age } = user;
        FriendModel.create({ name, age });
    } catch(error) {
        return 400;
    }

    return 200;
}

module.exports = {
    create
}