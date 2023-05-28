const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const { checkCurrentUser } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');
const { catchValidationError } = require('../middlewares/validation-checker.middleware');

router.post('/register', userController.createUser);
router.post('/login', userController.createToken);
router.put('/', checkCurrentUser, userController.updateUser);
router.delete('/', checkCurrentUser, userController.deleteUser);

module.exports = router;