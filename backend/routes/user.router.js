const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { checkCurrentUser } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');
const { catchValidationError } = require('../middlewares/validation-checker.middleware');

// TOOD: 인증 방식 수정, 유효성 검사 로직 추가
router.post('/register', userController.createUser);

router.post('/login', userController.createToken);

router.put('/', checkCurrentUser, userController.updateUser);

router.delete('/', checkCurrentUser, userController.deleteUser);

module.exports = router;