const supertest = require('supertest');

const app = require('../../app');
const dbConnect = require('../../database/connect');
const FriendModel = require('../../database/models/friendModel');
const { friendsQuery } = require('./queries');

let mongoose;
let id;

beforeAll(async () => {
    mongoose = await dbConnect(process.env.DB_HOST_TESTING);

    // create a user in the db
    let { _id: id } = await FriendModel.create({
        name: 'Mark',
        age: 30
    });
});

afterAll(async () => {
    await FriendModel.deleteMany({});
    await mongoose.connection.close();
});

describe('GraphQL basic tests', () => {
    it('should receive a response at root', async () => {
        const response = await supertest(app)
            .get('/');
        expect(response.status).toEqual(200);
        expect(response.text).toEqual('Hello world!');
    });

    it('should receive 400 /graphql if request has no data', async () => {
        const response = await supertest(app)
            .get('/graphql');
        expect(response.status).toEqual(400);
    });
});

describe('GraphQL tests: FRIEND/S QUERIES', () => {
    it('should be able to retrieve all friends', async () => {
        const response = await supertest(app)
            .post('/graphql')
            .send({ query: '{ friends { id name age } }' })
        const { data: { friends } } = JSON.parse(response.text);
        expect(response.status).toEqual(200);
        expect(friends).toHaveLength(1);
    });

    it('should be able to retrieve details of a friend, given an id' , () => {

    });

    it('should return 400 if an id was not', () => {

    });
});