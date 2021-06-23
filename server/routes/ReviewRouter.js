const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/ReviewController');
const { checkCurrentUser } = require('../middlewares/AuthMiddleware');

router.post('/', checkCurrentUser, reviewController.saveReview);
router.get('/:unitId', reviewController.getReviewsByUnit);

module.exports = router;