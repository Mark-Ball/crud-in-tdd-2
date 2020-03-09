const friendsQuery = `
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

const friendQuery = `
    query($id: ID!) {
        friend(id: $id) {
            name
            age
        }
    }
`;

const friendCreate = `
    mutation($name: String!, $age: Int!) {
        addFriend(name: $name, age: $age) {
            id
            name
            age
        }
    }
`;

module.exports = {
    friendsQuery,
    badQuery,
    friendQuery,
    friendCreate
};