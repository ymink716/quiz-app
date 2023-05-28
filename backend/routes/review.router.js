const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/ReviewController');
const { checkCurrentUser } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');
const { catchValidationError } = require('../middlewares/validation-checker.middleware');

router.post('/', [
    body('rate').notEmpty().isInt(),
    body('unitId').notEmpty().isMongoId(),
    catchValidationError,
], checkCurrentUser, reviewController.saveReview);

router.get('/:unitId', reviewController.getReviewsByUnit);

module.exports = router;