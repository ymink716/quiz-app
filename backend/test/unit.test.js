const request = require('supertest');
const { app } = require('../app');
const { Unit } = require('../models/unit');
const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

let token, userId, anotherUserId;
beforeAll(async () => {
    await mongoose.connect(process.env.mongoTestURI, {
        useNewUrlParser: true, useUnifiedTopology: true,
        useCreateIndex: true, useFindAndModify: false
      })
      .then(() => console.log('MongoDB Connected...'))
      .catch(err => console.log(err));

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('test1234', salt);
    await User.create({
        email: "test3@gmail.com",
        nickname: "tester3",
        password: password
    });
    const response = await request(app)
        .post('/api/user/login')
        .send({
            email: 'test3@gmail.com',
            password: 'test1234'
        });
    token = response.body.token;
    userId = response.body.user._id;

    const user = await User.create({
        email: 'test4@gmail.com',
        nickname: 'tester4',
        password: password
    });
    anotherUserId = user._id;
});

let unitId, anotherUserUnitId;
beforeEach(async () => {
    const unit = await Unit.create({
        title: 'test 1',
        description: 'test unit 1',
        isPublic: 'public',
        type: 'words',
        words: [
            {word: 'apple', meaning: '사과'},
            {word: 'water', meaning: '물'},
        ],
        maker: userId
    });
    unitId = unit._id;

    await Unit.create({
        title: 'test 2',
        description: 'test unit 2',
        isPublic: 'private',
        type: 'words',
        words: [
            {word: 'apple', meaning: '사과'},
            {word: 'water', meaning: '물'},
        ],
        maker: userId
    });

    const unit3 = await Unit.create({
        title: 'example ',
        description: 'example unit',
        isPublic: 'public',
        type: 'words',
        words: [
            {word: 'apple', meaning: '사과'},
            {word: 'water', meaning: '물'},
        ],
        maker: anotherUserId
    });
    anotherUserUnitId = unit3._id;
});

afterAll(async () => {
    await User.deleteMany({});
    await mongoose.disconnect();
});

afterEach(async () => {
    await Unit.deleteMany({});
});

describe("POST /api/unit", () => {
    test("return 201 status code & valid response", async () => {    
        const response = await request(app)
            .post('/api/unit')
            .set('Authorization', token)
            .send({ 
                title: 'test', 
                description: 'test unit', 
                isPublic: true,
                type: 'words', 
                words: [
                    {word: 'apple', meaning: '사과'},
                    {word: 'water', meaning: '물'},
                ], 
            });
        expect(response.statusCode).toBe(201);
        expect(response.body.newUnit.title).toBe('test');
    });

    test("return 500 error", async () => {
        const response = await request(app)
            .post('/api/unit')
            .set('Authorization', token)
            .send({ 
                title: 'test', 
                description: 'test unit', 
            });
        expect(response.statusCode).toBe(500);
    });
});

describe("GET /api/unit", () => {
    test("return 200 status code and public units", async () => {
        const response = await request(app).get('/api/unit');
        expect(response.statusCode).toBe(200);
        expect(response.body.units.length).toBe(2);
        expect(response.body.units[0]).toHaveProperty('title');
        expect(response.body.units[0]).toHaveProperty('description');
    });
});

describe("GET /api/unit/:unitId", () => {
    test("It should return a unit", async () => {
        const response = await request(app).get(`/api/unit/${unitId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('unit');
    });

    test("It should return 404 status code (not found)", async () => {
        const response = await request(app).get('/api/unit/6012826359d57631a4663277');
        expect(response.statusCode).toBe(404);
    });
});

describe("GET /api/unit/search/:text", () => {
    test("return 200 status code and searched units", async () => {
        const response = await request(app).get('/api/unit/search/test');
        expect(response.statusCode).toBe(200);
        expect(response.body.units.length).toBe(1);
        expect(response.body.units[0]).toHaveProperty('title');
        expect(response.body.units[0]).toHaveProperty('description');
    });
});

describe("PUT /api/unit/:unitId", () => {
    test("It should return updated unit", async () => {
        const response = await request(app)
            .put(`/api/unit/${unitId}`)
            .set("authorization", token)
            .send({
                title: 'updated unit',
                description: 'updated..'
            });
        expect(response.statusCode).toBe(200);
        expect(response.body.updatedUnit.title).toBe('updated unit');
        expect(response.body.updatedUnit.description).toBe('updated..');
    });

    test("It should return 404 status code (not found)", async () => {
        const response = await request(app)
            .put('/api/unit/6012826359d57631a4663277')
            .set("authorization", token)
            .send({
                title: 'updated unit',
                description: 'updated..'
            });
        expect(response.statusCode).toBe(404);
    });

    test("It should return 403 status code (forbidden)", async () => {
        const response = await request(app)
            .put(`/api/unit/${anotherUserUnitId}`)
            .set("authorization", token)
            .send({
                title: 'updated unit',
                description: 'updated..'
            });
        expect(response.statusCode).toBe(403);
    });
});

describe("DELETE /api/unit/:unitId", () => {
    test("It should return 200 status code", async () => {
        const response = await request(app)
            .delete(`/api/unit/${unitId}`)
            .set("authorization", token);
        expect(response.statusCode).toBe(200);
    });

    test("It should return 404 status code (not found)", async () => {
        const response = await request(app)
            .delete('/api/unit/6012826359d57631a4663277')
            .set("authorization", token);
        expect(response.statusCode).toBe(404);
    });

    test("It should return 403 status code (forbidden)", async () => {
        const response = await request(app)
            .delete(`/api/unit/${anotherUserUnitId}`)
            .set("authorization", token);
        expect(response.statusCode).toBe(403);
    });
});