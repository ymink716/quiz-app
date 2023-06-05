const express = require('express');
const router = express.Router();
const imageService = require('../service/image.service');
const { checkCurrentUser } = require('../middlewares/auth.middleware');
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../config/s3');
const { body } = require('express-validator');
const { catchValidationError } = require('../middlewares/validation-checker.middleware');
const { asyncWrapper } = require('../middlewares/async-wrapper.middleware');

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET_NAME,
        ACL: 'public-read',
        key: function(rqe, file, cb) {
            cb(null, `${Date.now()}_${file.originalname}`);
        }
    })
});

router.post('/', 
  [
    body('title').notEmpty().isString().isLength({ max: 50 }),
    body('description').isString().isLength({ max: 255 }),
    body('isPublic').notEmpty().isIn('public', 'private'),
    body('folderId').notEmpty().isMongoId(),
    catchValidationError,
  ], 
  checkCurrentUser, upload.single("image"), 
  asyncWrapper(async (req, res) => {
    const { title, description, isPublic, folderId } = req.body;
    const url = req.file.location;
    const userId = req.currentUser._id;

    await imageService.uploadImage(title, description, isPublic, folderId, url, userId);

    res.status(201).json({ success: true });
  })
);

router.delete('/:imageId', 
  checkCurrentUser, 
  asyncWrapper(async (req, res) => {
    const imageId = req.params.imageId;
    const userId = req.currentUser._id;

    await imageService.deleteImage(imageId, userId);
    
    res.status(200).json({ success: true });
  })
);

module.exports = router;