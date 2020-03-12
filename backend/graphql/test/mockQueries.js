const queryFriends = `
    query {
        friends {
            id
            name
            age
        }
    }
`;

const badQuery = `
    query {
        friends {
            blah
        }
    }
`;

const queryFriend = `
    query($id: ID!) {
        friend(id: $id) {
            name
            age
        }
    }
`;

const createFriend = `
    mutation($name: String!, $age: Int!) {
        addFriend(name: $name, age: $age) {
            id
            name
            age
        }
    }
`;

const updateFriend = `
    mutation($id: ID!, $name: String, $age: Int) {
        updateFriend(id: $id, name: $name, age: $age) {
            name
            age
        }
    }
`;

const deleteFriend = `
    mutation($id: ID!) {
        deleteFriend(id: $id) {
            ok
        }
    }
`;

module.exports = {
    queryFriends,
    badQuery,
    queryFriend,
    createFriend,
    updateFriend,
    deleteFriend
};