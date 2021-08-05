const express = require('express');
const router = express.Router();
const imageController = require('../controllers/ImageController');
const { checkCurrentUser } = require('../middlewares/AuthMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const dirPath = path.resolve(__dirname, '..', '..', 'uploads');

function checkUploadPath(req, res, next) {
    fs.exists(dirPath, function(exist) {
        if (exist) {
            next();
        } else {
            fs.mkdir(dirPath, function(error) {
                if (error) {
                    console.error(error);
                    next(error);
                } else {
                    next();
                }
            })
        }
    })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
});

const upload = multer({ storage }).single("image");

router.post('/', checkCurrentUser, checkUploadPath, upload, imageController.uploadImage);
router.delete('/:imageId', checkCurrentUser, imageController.deleteImage);

module.exports = router;