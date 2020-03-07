const friendsQuery = `
    query {
        friends {
            id
            name
            age
        }
    }
}`

module.exports = {
    friendsQuery
};