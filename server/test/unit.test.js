// const request = require('supertest');
// process.env.NODE_ENV = "test";
// const { app } = require('../app');

// // let token;
// // // beforeAll(async () => {
// // //     const response = await request(app)
// // //         .post('/api/user/register')
// // //         .send({ })
// // // });


// describe("POST /api/unit", () => {
//     test("return 201 status code & valid response", async () => {
//         const { title, description, isPublic, words, folderId } = newUnit;
    
//         const response = await request(app)
//             .post('/api/unit')
//             .set('Authorization', token)
//             .send({ title, description, isPublic, words, folder: folderId });
//         expect(response.statusCode).toBe(201);
//         expect(response.body.success).toBe(true);
//         expect(response.body.newUnit.title).toBe(newUnit.title);
//     });

//     test("return 500 error", async () => {
//         const { title, description, words } = newUnit;

//         const response = await request(app)
//             .post('/api/unit')
//             .set('Authorization', token)
//             .send({ title, description, words });
//         expect(response.body).toStrictEqual({ message: 'Unit validation failed: isPublic: Path `isPublic` is required.' })
//     });
// });

// describe("GET /api/unit", () => {
//     test("return 200 status code & json body", async () => {
//         const response = await request(app).get('/api/unit');
//         expect(response.statusCode).toBe(200);
//         //expect(Array.isArray(response.body)).toBeTruthy();
//         //expect(response.body.units[0].title).toBeDefined();
//         //expect(response.body.units[0].description).toBeDefined();
//     });
// })



