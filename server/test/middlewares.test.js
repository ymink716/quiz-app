const { checkCurrentUser } = require('../middlewares/AuthMiddleware');
const { User } = require('../models/user');
const jwt = require('jsonwebtoken');

User.findOne = jest.fn();

describe('AuthMiddleWare check current user', () => {
    let req, res, next, jwtSpy;
    beforeEach(async () => {
        req = {
            headers: {}
        };
        res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };
        next = jest.fn();
        jwtSpy = jest.spyOn(jwt, 'verify');
    });

    test("It should pass on right jwt", async () => {
        req.headers["authorization"] = 'right jwt';
        jwtSpy.mockReturnValue('Some decoded token');
        User.findOne.mockReturnValueOnce({ email: 'test@gmail.com' });
        await checkCurrentUser(req, res, next);
        expect(next).toBeCalledTimes(1);
    });

    test("without authorization headers", async () => {
        await checkCurrentUser(req, res, next);
        expect(res.status).toBeCalledWith(401);
        expect(res.json).toBeCalledWith({ success: false, message: 'No token provided' });
    });

    test("invalid token provided", async () => {
        req.headers["authorization"] = 'invalid token';
        jwtSpy.mockReturnValueOnce(new Error('error..'));
        await checkCurrentUser(req, res, next);
        expect(res.status).toBeCalledWith(401);
        expect(res.json).toBeCalledWith({ success: false, message: 'Invalid token provided' });
    });
});

