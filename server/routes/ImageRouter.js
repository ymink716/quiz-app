const express = require('express');
const router = express.Router();
const imageController = require('../controllers/ImageController');
const { checkCurrentUser } = require('../middlewares/AuthMiddleware');
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../config/s3');

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET_NAME,
        ACL: 'public-read-write',
        key: function(rqe, file, cb) {
            cb(null, `${Date.now()}_${file.originalname}`);
        }
    })
})

router.post('/', checkCurrentUser, upload.single("image"), imageController.uploadImage);
router.delete('/:imageId', checkCurrentUser, imageController.deleteImage);

module.exports = router;