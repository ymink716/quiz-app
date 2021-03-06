const express = require('express');
const router = express.Router();
const imageController = require('../controllers/ImageController');
const { checkCurrentUser } = require('../middlewares/AuthMiddleware');
const { upload } = require('../middlewares/UploadMiddleware');

router.post('/upload', checkCurrentUser, upload, imageController.uploadImage);
router.post('/', checkCurrentUser, imageController.createImage);

module.exports = router;