const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

router.post('/register', authController.createUser);
router.post('/login', authController.createToken);

module.exports = router;