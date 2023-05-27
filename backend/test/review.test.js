const request = require('supertest');
const { app } = require('../app');
const { Review } = require('../models/review');
const { Unit } = require('../models/unit');
const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

let token, userId;
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
        email: "test2@gmail.com",
        nickname: "tester2",
        password: password
    });
    const response = await request(app)
        .post('/api/user/login')
        .send({
            email: 'test2@gmail.com',
            password: 'test1234'
        });
    token = response.body.token;
    userId = response.body.user._id;
});

let unitId;
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

    await Review.create({ userId, rate: 4, unitId });
});

afterAll(async () => {
    await User.deleteOne({ email: 'test2@gmail.com' });
    await mongoose.disconnect();
});

afterEach(async () => {
    await Unit.deleteMany({});
    await Review.deleteMany({});
});

describe("POST /api/review", () => {
    test("It should return 201 status code and review data", async () => {
        const response = await request(app)
            .post('/api/review')
            .set('Authorization', token)
            .send({ unitId: unitId, rate: 5 });
        expect(response.statusCode).toBe(201);
        expect(response.body.review.rate).toBe(5);
        expect(response.body).toHaveProperty('reviews');
    });
});

describe("GET /api/review/:unitId", () => {
    test("It should return review data by unit", async () => {
        const response = await request(app).get(`/api/review/${unitId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.reviews.length).toBe(1);
        expect(response.body.reviews[0].rate).toBe(4);
    });
});