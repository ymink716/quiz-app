const express = require('express');
const router = express.Router();
const imageController = require('../controllers/ImageController');
const { checkCurrentUser } = require('../middlewares/AuthMiddleware');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
});

const upload = multer({ storage }).single("image");

router.post('/', checkCurrentUser, upload, imageController.uploadImage);
router.delete('/:imageId', checkCurrentUser, imageController.deleteImage);

module.exports = router;