/*
import { create } from './../../backend/controllers/friendController';
import FriendModel from './../../backend/database/models/friendModel';
import dbConnect from './../../backend/database/connect';

let mongoose;

beforeAll(async () => {
    mongoose = await dbConnect(process.env.DB_HOST_TESTING);
});

afterAll(async () => {
    // await FriendModel.deleteMany({});
    await mongoose.connection.close();
});

it('Tests can be run in friendController.test.js', () => {
    expect(true).toBe(true);
});

describe('Create functionality', () => {
    describe('Unit tests', () => {
        it('Create function with bad request returns 400', () => {
            expect(create({ name: 'Mark' })).toEqual(400);
        });

        it('Create function with good request returns 200', () => {
            expect(create({ name: 'Mark', age: 30 })).toEqual(200);
        });
    });

    describe('Integration tests', () => {
        it('Entry created in db can be retrieved', async () => {
            create({ name: 'Tom', age: 25 });
            const user = await FriendModel.find();
            console.log(user);
            // expect(user[user.length - 1].name).toEqual('Tom');
            // expect(user[user.length - 1].age).toEqual(25);
        });
    });
});


*/