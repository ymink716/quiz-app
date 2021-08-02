const request = require('supertest');
const { app } = require('../app');
const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

let token;
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
});

afterAll(async () => {
    await User.deleteMany({});
    await mongoose.disconnect();
});

describe("POST /api/user/register", () => {
    test("It should return 201 and new user", async () => {
        const response = await request(app)
            .post('/api/user/register')
            .send({
                email: "test@naver.com",
                nickname: "tester2",
                password: "123456",
            });
        expect(response.statusCode).toBe(201);
        expect(response.body.newUser.email).toBe("test@naver.com");
        expect(response.body.newUser.nickname).toBe("tester2");
    });

    test("It should return 409 (this email is alrerady in use)", async () => {
        const response = await request(app)
            .post('/api/user/register')
            .send({
                email: "test@gmail.com",
                nickname: "tester",
                password: "test1234",
            });
        expect(response.statusCode).toBe(409);
        expect(response.body).toStrictEqual({ message: 'This email is already in use.' });
    });

    test("return 500 error", async () => {
        const response = await request(app)
            .post('/api/user/register')
            .send({
                nickname: "tester",
                password: "123456",
            });
        expect(response.statusCode).toBe(500);
        expect(response.body).toStrictEqual({ message: 'User validation failed: email: Path `email` is required.' });
    });
});

describe("POST /api/user/login", () => {
    test("It should return 200 and token", async () => {
        const response = await request(app)
            .post('/api/user/login')
            .send({
                email: 'test@gmail.com',
                password: 'test1234'
            });
        expect(response.statusCode).toBe(200);
        expect(response.body.user.email).toBe('test@gmail.com');
        expect(response.body).toHaveProperty('token');
    });

    test("It should return 401 (id or password is wrong)", async () => {
        const response = await request(app)
            .post('/api/user/login')
            .send({
                email: 'test@gmail.com',
                password: 'wrongpassword'
            });
        expect(response.statusCode).toBe(401);
        expect(response.body).toStrictEqual({ message: 'Please check your ID and password again.' });
    });
});

describe("PUT /api/user", () => {
    test("change password", async () => {
        const response = await request(app)
            .put('/api/user')
            .set("authorization", token)
            .send({ 
                currentPassword: 'test1234',
                newPassword: 'newPassword' 
            });
        expect(response.statusCode).toBe(200);
    });

    test("update profile", async () => {
        const response = await request(app)
            .put('/api/user')
            .set("authorization", token)
            .send({ nickname: 'tester11' });
        expect(response.statusCode).toBe(200);
        expect(response.body.user.nickname).toBe('tester11');
    });
    
    test("return 401 (password is wrong)", async () => {
        const response = await request(app)
            .put('/api/user')
            .set("authorization", token)
            .send({ 
                currentPassword: 'test1235',
                newPassword: 'newPassword' 
            });
        expect(response.statusCode).toBe(401);
    });
});

describe("DELETE /api/user", () => {
    test("It should return 401 (passwrod is wrong)", async () => {
        const response = await request(app)
            .delete('/api/user')
            .set("authorization", token)
            .send({ password: '123456' });
        expect(response.statusCode).toBe(401);
    });

    test("It should return 200", async () => {
        const response = await request(app)
            .delete('/api/user')
            .set("authorization", token)
            .send({ password: 'newPassword' });
        expect(response.statusCode).toBe(200);
    });
});