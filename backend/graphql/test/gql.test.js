const supertest = require('supertest');
const app = require('../../app');

describe('GraphQL integration tests', () => {
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