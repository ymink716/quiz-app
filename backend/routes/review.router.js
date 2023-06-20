const express = require('express');
const router = express.Router();
const reviewService = require('../services/review.service');
const { checkCurrentUser } = require('../middlewares/auth.middleware');
const { body, param } = require('express-validator');
const { catchValidationError } = require('../middlewares/validation-checker');
const { asyncWrapper } = require('../middlewares/async-wrapper');

router.post('/', 
  [
    body('rate').notEmpty().isInt(),
    body('unitId').notEmpty().isMongoId(),
    catchValidationError,
  ], 
  checkCurrentUser, 
  asyncWrapper(async (req, res) => {
    const userId = req.currentUser._id;
    const { unitId, rate } = req.body;
    
    const reviews = await reviewService.saveReview(userId, unitId, rate);

    res.status(201).json({ success: true, reviews });
  })
);

router.get('/:unitId', 
  [param('unitId').notEmpty().isMongoId(), catchValidationError],
  asyncWrapper(async (req, res) => {
    const unitId = req.params.unitId;

    const reviews = await reviewService.getReviewsByUnit(unitId);

    res.status(200).json({ success: true, reviews });
  }) 
);

module.exports = router;