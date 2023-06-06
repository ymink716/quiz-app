const express = require('express');
const router = express.Router();
const userService = require('../service/user.service');
const { checkCurrentUser } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');
const { catchValidationError } = require('../middlewares/validation-checker');
const { asyncWrapper } = require('../middlewares/async-wrapper');

// TODO: 인증 방식 수정 -> Oauth, refesh token

router.post('/register', 
  [
    body('email').notEmpty().isEmail(),
    body('nickname').notEmpty().isString(),
    body('password').notEmpty().isString(),
    catchValidationError
  ], 
  asyncWrapper(async (req, res) => {
    const { email, nickname, password } = req.body;
    
    await userService.createUser(email, nickname, password);

    res.status(201).json({ success: true });
  })
);

router.post('/login',
  [
    body('email').notEmpty().isEmail(),
    body('nickname').notEmpty().isString(),
    body('password').notEmpty().isString(),
    catchValidationError
  ],
  asyncWrapper(async (req, res) => {
    const { email, password } = req.body;

    const { user, token } = await userService.createToken(email, password);

    return res.status(200).json({ success: true, user, token });
  }) 
);

// router.put('/', checkCurrentUser, userService.updateUser);

// router.delete('/', checkCurrentUser, userService.deleteUser);

module.exports = router;