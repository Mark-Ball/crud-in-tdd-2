const supertest = require('supertest');

const app = require('../../app');
const dbConnect = require('../../database/connect');
const FriendModel = require('../../database/models/friendModel');
const {
    queryFriends,
    badQuery,
    queryFriend,
    createFriend,
    updateFriend,
    deleteFriend
} = require('./mockQueries');

let mongoose;
let id;

beforeAll(async () => {
    mongoose = await dbConnect(process.env.DB_HOST_TESTING);
});

beforeEach(async () => {
    // create a user in the db, get the id
    const friend = await FriendModel.create({
        name: 'Mark',
        age: 30
    });
    id = friend._id
});

afterEach(async () => {
    // delete all entries in the friends collection
    await FriendModel.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('GraphQL basic tests', () => {
    it('should receive a response at root', async () => {
        const response = await supertest(app)
            .get('/');

        expect(response.status).toBe(200);
        expect(response.text).toBe('Hello world!');
    });

    it('should receive 400 /graphql if request has no data', async () => {
        const response = await supertest(app)
            .get('/graphql');

        expect(response.status).toBe(400);
    });
});

describe('GraphQL tests: querying friends', () => {
    it('should be able to retrieve all friends', async () => {
        const response = await supertest(app)
            .post('/graphql')
            .send({ query: queryFriends });
        const { data: { friends } } = JSON.parse(response.text);

        expect(response.status).toBe(200);
        expect(friends).toHaveLength(1);
    });

    it('should return 400 if a property which does not exist was requested', async () => {
        const response = await supertest(app)
            .post('/graphql')
            .send({ query: badQuery });

        expect(response.status).toBe(400);
    });

    it('should be able to retrieve details of a friend, given an id' , async () => {
        const postData = {
            query: queryFriend,
            variables: { id }
        };

        const response = await supertest(app) 
            .post('/graphql')
            .send(postData);
        const { 
            data: { friend: { name } }, // destructures name
            data: { friend: { age } }  // destructures age
        } = JSON.parse(response.text);

        expect(response.status).toBe(200);
        expect(name).toBe('Mark');
        expect(age).toBe(30);
    });

    it('should respond with 400 if an id was not provided', async () => {
        const postData = {
            query: queryFriend,
            variables: {}
        };
        const response = await supertest(app)
            .post('/graphql')
            .send(postData);

        expect(response.status).toBe(500);
    });
});

describe('GraphQL tests: creating friends', () => {
    it('should respond with the created friend if the request is valid', async () => {
        const postData = {
            query: createFriend,
            variables: { name: 'Jon', age: 25 }
        };
        const response = await supertest(app)
            .post('/graphql')
            .send(postData);
        const { 
            data: { addFriend: { name } }, // destructures name
            data: { addFriend: { age } } // destructured age
        } = JSON.parse(response.text);

        expect(response.status).toBe(200);
        expect(name).toBe('Jon');
        expect(age).toBe(25);
    });

    it('should respond with 500 if data is missing', async () => {
        const postData = {
            query: createFriend,
            variables: { name: 'Tim' }
        };
        const response = await supertest(app)
            .post('/graphql')
            .send(postData);

        expect(response.status).toBe(500);
    });
});

describe('GraphQL tests: editing friends', () => {
    it('should update a friend if valid details are provided', async () => {
        const postData = {
            query: updateFriend,
            variables: { id, name: 'James', age: 35 }
        };
        const response = await supertest(app)
            .post('/graphql')
            .send(postData);
        const {
            data: { updateFriend: { name } },
            data: { updateFriend: { age } }
        } = JSON.parse(response.text);
        console.log(JSON.parse(response.text));

        expect(response.status).toBe(200);
        expect(name).toBe('James');
        expect(age).toBe(35);
    });

    it('should error if no id provided', async () => {
        const postData = {
            query: updateFriend,
            variables: { name: 'James', age: 35 }
        };
        const response = await supertest(app)
            .post('/graphql')
            .send(postData);

        expect(response.status).toBe(500);
    });

    it('should error if id of non-existent entry provided', async () => {
        const postData = {
            query: updateFriend,
            variables: { id: 1234, name: 'James', age: 35 }
        };
        const response = await supertest(app)
            .post('/graphql')
            .send(postData);
        const { errors } = JSON.parse(response.text);

        expect(errors).toBeTruthy();
    });

    it('should disallow removal of fields ', async () => {
        // attempting to change name to empty string
        const postData = {
            query: updateFriend,
            variables: { id, name: '', age: 35 }
        };
        const response = await supertest(app)
            .post('/graphql')
            .send(postData);

        // name should remain unchanged i.e. still 'Mark'
        const { data: { updateFriend: { name } } } = JSON.parse(response.text);

        expect(name).toBe('Mark');
    });
});

describe('GraphQL tests: deleting friends', () => {
    it.only('should delete a friend when the id is provided', async () => {
        const postData = {
            query: deleteFriend,
            variables: { id }
        };
        await supertest(app)
            .post('/graphql')
            .send(postData);

        // search for the document which was just deleted to confirm that it is not there
        const response = await supertest(app)
            .post('/graphql')
            .send({ query: queryFriends });
        // console.log(response);
        const { data: { friends } } = JSON.parse(response.text);

        // since the document was deleted, we expect to find nothing
        expect(friends).toHaveLength(0);
    });

    it('should error when no id is provided', async () => {
        const postData = {
            query: deleteFriend,
            variables: {}
        };
        const response = await supertest(app)
            .post('/graphql')
            .send(postData);
        const { errors } = JSON.parse(response.text);

        expect(errors).toBeTruthy();
    });

    it('should error when the id does not exist in db', async () => {
        const postData = {
            query: deleteFriend,
            variables: { id: 1234 }
        };
        const response = await supertest(app)
            .post('/graphql')
            .send(postData);
        const { errors } = JSON.parse(response.text);

        expect(errors).toBeTruthy();
    });
});