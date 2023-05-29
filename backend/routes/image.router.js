const express = require('express');
const router = express.Router();
const imageController = require('../controllers/image.controller');
const { checkCurrentUser } = require('../middlewares/auth.middleware');
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../config/s3');
const { body } = require('express-validator');
const { catchValidationError } = require('../middlewares/validation-checker.middleware');

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET_NAME,
        ACL: 'public-read',
        key: function(rqe, file, cb) {
            cb(null, `${Date.now()}_${file.originalname}`);
        }
    })
})

router.post('/', [
    body('title').notEmpty().isString().isLength({ max: 50 }),
    body('description').isString().isLength({ max: 255 }),
    body('isPublic').notEmpty().isIn('public', 'private'),
    body('folderId').notEmpty().isMongoId(),
    catchValidationError,
], checkCurrentUser, upload.single("image"), imageController.uploadImage);

router.delete('/:imageId', checkCurrentUser, imageController.deleteImage);

module.exports = router;