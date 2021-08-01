const request = require('supertest');
//process.env.NODE_ENV = "test";
const { app } = require('../app');
const { Unit } = require('../models/unit');
const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const path = require('path');
const mongoose = require('mongoose');

let token, userId;
beforeAll(async () => {
    const password = await bcrypt.hash('test1234', 12);
    await User.create({
        email: "test1@gmail.com",
        nickname: "tester",
        password: password
    });
    const response = await request(app)
        .post('/api/user/login')
        .send({
            email: 'test1@gmail.com',
            password: 'test1234'
        });
    token = response.body.token;
    userId = response.body.user._id;
});

afterAll(async () => {
    await User.deleteOne({ email: 'test1@gmail.com' });
    await Unit.deleteMany({});
    await mongoose.disconnect();
});

describe("POST /api/image", () => {
    test("It should return 201 status code and new image", async () => {
        const response = await request(app)
            .post('/api/image')
            .set('Authorization', token)
            .field('title', 'image 1')
            .field('description', 'test image 1')
            .field('isPublic', 'public')
            .attach('image', path.join(__dirname, '/data/apple.jpg'));
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('newImage');
    });

    test("return 500 error", async () => {
        const response = await request(app)
            .post('/api/image')
            .set('Authorization', token)
            .field('description', 'test image 1')
            .field('isPublic', 'public')
            .attach('image', path.join(__dirname, '/data/apple.jpg'));
        expect(response.statusCode).toBe(500);
    });
});

describe("DELETE /api/image", () => {
    test("It should return 200 and deleted image", async () => {
        const uploadImageRes = await request(app)
            .post('/api/image')
            .set('Authorization', token)
            .field('title', 'image 1')
            .field('description', 'test image 1')
            .field('isPublic', true)
            .attach('image', path.join(__dirname, '/data/apple.jpg'));
        const imageId = uploadImageRes.body.newImage._id;

        const response = await request(app)
            .delete(`/api/image/${imageId}`)
            .set("authorization", token);
        expect(response.statusCode).toBe(200);
    });

    test("It should return 404 error (not found)", async () => {
        const response = await request(app)
            .delete('/api/image/6012826359d57631a4663277')
            .set("authorization", token);
        expect(response.statusCode).toBe(404);
    });
});