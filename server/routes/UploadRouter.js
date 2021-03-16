const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/UploadController');
const { checkCurrentUser } = require('../middlewares/AuthMiddleware');
const { upload } = require('../middlewares/UploadMiddleware');

router.post('/', checkCurrentUser, upload, uploadController.uploadImage);

module.exports = router;