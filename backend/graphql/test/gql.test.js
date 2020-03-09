const supertest = require('supertest');

const app = require('../../app');
const dbConnect = require('../../database/connect');
const FriendModel = require('../../database/models/friendModel');
const {
    friendsQuery,
    badQuery,
    friendQuery,
    friendCreate
} = require('./mockQueries');

let mongoose;
let id;

beforeAll(async () => {
    mongoose = await dbConnect(process.env.DB_HOST_TESTING);

    // create a user in the db, get the id
    const friend = await FriendModel.create({
        name: 'Mark',
        age: 30
    });
    id = friend._id
});

afterAll(async () => {
    await FriendModel.deleteMany({});
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

describe('GraphQL tests | Controller: friend | Action: query', () => {
    it('should be able to retrieve all friends', async () => {
        const response = await supertest(app)
            .post('/graphql')
            .send({ query: friendsQuery });
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
            query: friendQuery,
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
            query: friendQuery,
            variables: {}
        };
        const response = await supertest(app)
            .post('/graphql')
            .send(postData);

        expect(response.status).toBe(500);
    });
});

describe('GraphQL tests | Controller: friend | Action: mutation, create', () => {
    it('should respond with the created friend if the request is valid', async () => {
        const postData = {
            mutation: friendCreate,
            variables: { name: 'Jon', age: 25 }
        };
        const response = await supertest(app)
            .post('/graphql')
            .send(postData);
        const { 
            data: { friend: { name } }, // destructures name
            data: { friend: { age } } // destructured age
        } = JSON.parse(response.text);

        expect(response.status).toBe(200);
        expect(name).toBe('Jon');
        expect(age).toBe(25);
    });

    it('should respond with 400 if data is missing', async () => {
        const postData = {
            mutation: friendCreate,
            variables: { name: 'Tim' }
        };
        const response = await supertest(app)
            .post('/graphql')
            .send(postData);

        expect(response.status).toBe(400);
    });
});