const request = require('supertest');
const { app } = require('../app');
const { Folder } = require('../models/folder');
const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

let token, userId, anotherUserId;
beforeAll(async () => {
    const password = await bcrypt.hash('test1234', 12);
    await User.create({
        email: "test7@gmail.com",
        nickname: "tester",
        password: password
    });
    const response = await request(app)
        .post('/api/user/login')
        .send({
            email: 'test7@gmail.com',
            password: 'test1234'
        });
    token = response.body.token;
    userId = response.body.user._id;

    const anotherUser = await User.create({
        email: 'test8@gmail.com',
        nickname: 'tester2',
        password: password
    });
    anotherUserId = anotherUser._id;
});

let folderId, anotherUserFolderId;
beforeEach(async () => {
    const folder = await Folder.create({
        title: 'folder1',
        description: 'test folder 1',
        maker: userId
    });

    await Folder.create({
        title: 'folder2',
        description: 'test folder 2',
        maker: userId
    });

    const anotherUserFolder = await Folder.create({
        title: 'folder3',
        description: 'test folder 3',
        maker: anotherUserId    
    });

    folderId = folder._id;
    anotherUserFolderId = anotherUserFolder._id;
});

afterAll(async () => {
    await User.deleteMany({});
    await mongoose.disconnect();
});

afterEach(async () => {
    await Folder.deleteMany({});
});

describe("POST /api/folder", () => {
    test("It should return 201 status code and new folder", async () => {
        const response = await request(app)
            .post('/api/folder')
            .set("authorization", token)
            .send({
                title: "new folder",
                description: "test folder"
            });
        expect(response.statusCode).toBe(201);
        expect(response.body.newFolder.title).toBe('new folder');
    });

    test("It should handle error", async () => {
        const response = await request(app)
            .post('/api/folder')
            .set("authorization", token)
            .send({
                description: "test folder"
            });
        expect(response.statusCode).toBe(500);
    });
});

describe("GET /api/folder/myFolders", () => {
    test("It should return 200 status code and folders", async () => {
        const response = await request(app)
            .get('/api/folder/myFolders')
            .set("authorization", token);
        expect(response.statusCode).toBe(200);
        expect(response.body.folders.length).toBe(2);
        expect(response.body.folders[0]).toHaveProperty('title');
        expect(response.body.folders[0]).toHaveProperty('description');
    });
});

describe("GET /api/folder/:folderId", () => {
    test("It should return folder and related units", async () => {
        const response = await request(app)
            .get(`/api/folder/${folderId}`)
            .set("authorization", token);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('folder');
        expect(response.body).toHaveProperty('units');
    });

    test("It should return 404 status code (not found)", async () => {
        const response = await request(app)
            .get('/api/folder/6012826359d57631a4663277')
            .set("authorization", token);
        expect(response.statusCode).toBe(404);
    });
});

describe("PUT /api/folder/:folderId", () => {
    test("It should return updated folder", async () => {
        const response = await request(app)
            .put(`/api/folder/${folderId}`)
            .set("authorization", token)
            .send({
                title: 'updated folder',
                description: 'updated..'
            });
        expect(response.statusCode).toBe(200);
        expect(response.body.updatedFolder.title).toBe('updated folder');
        expect(response.body.updatedFolder.description).toBe('updated..');
    });

    test("It should return 404 status code (not found)", async () => {
        const response = await request(app)
            .put('/api/folder/6012826359d57631a4663277')
            .set("authorization", token)
            .send({
                title: 'updated folder',
                description: 'updated..'
            });
        expect(response.statusCode).toBe(404);
    });

    test("It should return 403 status code (forbidden)", async () => {
        const response = await request(app)
            .put(`/api/folder/${anotherUserFolderId}`)
            .set("authorization", token)
            .send({
                title: 'updated folder',
                description: 'updated..'
            });
        expect(response.statusCode).toBe(403);
    });
});

describe("DELETE /api/folder/:folderId", () => {
    test("It should return 200 status code", async () => {
        const response = await request(app)
            .delete(`/api/folder/${folderId}`)
            .set("authorization", token);
        expect(response.statusCode).toBe(200);
    });

    test("It should return 404 status code (not found)", async () => {
        const response = await request(app)
            .delete('/api/folder/6012826359d57631a4663277')
            .set("authorization", token);
        expect(response.statusCode).toBe(404);
    });

    test("It should return 403 status code (forbidden)", async () => {
        const response = await request(app)
            .put(`/api/folder/${anotherUserFolderId}`)
            .set("authorization", token);
        expect(response.statusCode).toBe(403);
    });
});