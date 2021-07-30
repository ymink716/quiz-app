const request = require('supertest');
process.env.NODE_ENV = "test";
const { app } = require('../app');
const { Bookmark } = require('../models/bookmark');
const { Unit } = require('../models/unit');
const { User } = require('../models/user');
const bcrypt = require('bcrypt');

let token, userId;
beforeAll(async () => {
    const password = await bcrypt.hash('test1234', 12);
    await User.create({
        email: "test@gmail.com",
        nickname: "tester",
        password: password
    });
    const response = await request(app)
        .post('/api/user/login')
        .send({
            email: 'test@gmail.com',
            password: 'test1234'
        });
    token = response.body.token;
    userId = response.body.user._id;
});

let unit1Id, unit2Id;
beforeEach(async () => {
    const unit1 = await Unit.create({
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
    unit1Id = unit1._id;

    const unit2 = await Unit.create({
        title: 'test 2',
        description: 'test unit 2',
        isPublic: 'public',
        type: 'words',
        words: [
            {word: 'apple', meaning: '사과'},
            {word: 'water', meaning: '물'},
        ],
        maker: userId
    });
    unit2Id = unit2._id;

    await Bookmark.create({ userId: userId, unitId: unit1Id });
});

afterAll(async () => {
    await User.deleteOne({ email: 'test@gmail.com' });
});

afterEach(async () => {
    await Unit.deleteMany({});
    await Bookmark.deleteMany({});
});

describe("POST /api/bookmark", () => {
    test("It should return 201 status code & valid response", async () => {
        const response = await request(app)
            .post('/api/bookmark')
            .set('Authorization', token)
            .send({ unitId: unit2Id });
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('bookmark');
    });

    test("handle 500 error", async () => {
        const response = await request(app)
            .post('/api/bookmark')
            .set('Authorization', token)
        expect(response.statusCode).toBe(500);
    });
});

describe("DELETE /api/bookmark", () => {
    test("It should return 200 status code", async () => {
        const response = await request(app)
            .delete('/api/bookmark')
            .set('Authorization', token)
            .send({ userId: userId, unitId: unit1Id });
        expect(response.statusCode).toBe(200);
    });

    test("It should return 404 status code (not found)", async () => {
        const response = await request(app)
            .delete('/api/bookmark')
            .set('Authorization', token)
            .send({ userId: userId, unitId: '6012826359d57631a4663277' });
        expect(response.statusCode).toBe(404);
    });
});

describe("GET /api/bookmark/counts/:unitId", () => {
    test("It should return bookmarks by unit", async () => {
        const response = await request(app)
            .get(`/api/bookmark/counts/${unit1Id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.bookmarks.length).toBe(1);
    });
});

describe("GET /api/bookmark/users", () => {
    test("It should return bookmarks by user", async () => {
        const response = await request(app)
            .get('/api/bookmark/users')
            .set('Authorization', token);
        expect(response.statusCode).toBe(200);
        expect(response.body.bookmarks.length).toBe(1);
        expect(response.body.units.length).toBe(1);
    });
});