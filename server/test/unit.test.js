const request = require('supertest');
process.env.NODE_ENV = "test";
const { app } = require('../app');
const { Unit } = require('../models/unit');
const { User } = require('../models/user');
const bcrypt = require('bcrypt');

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
    await User.deleteOne({ email: "test@gmail.com" });

});

describe("POST /api/unit", () => {
    test("return 201 status code & valid response", async () => {
        const { title, description, isPublic, words, folderId } = newUnit;
    
        const response = await request(app)
            .post('/api/unit')
            .set('Authorization', token)
            .send({ title, description, isPublic, words, folder: folderId });
        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.newUnit.title).toBe(newUnit.title);
    });

    test("return 500 error", async () => {
        const { title, description, words } = newUnit;

        const response = await request(app)
            .post('/api/unit')
            .set('Authorization', token)
            .send({ title, description, words });
        expect(response.body).toStrictEqual({ message: 'Unit validation failed: isPublic: Path `isPublic` is required.' })
    });
});

describe("GET /api/unit", () => {
    test("return 200 status code & json body", async () => {
        const response = await request(app).get('/api/unit');
        expect(response.statusCode).toBe(200);
        //expect(Array.isArray(response.body)).toBeTruthy();
        //expect(response.body.units[0].title).toBeDefined();
        //expect(response.body.units[0].description).toBeDefined();
    });
})

describe("GET /api/unit/:unitId", () => {

});

describe("GET /api/unit/search/:text", () => {

});

describe("PUT /api/unit/:unitId", () => {

});

describe("DELETE /api/unit/:unitId", () => {

});



