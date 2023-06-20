const express = require('express');
const router = express.Router();
const bookmarkService = require('../services/bookmark.service');
const { checkCurrentUser } = require('../middlewares/auth.middleware');
const { body, param } = require('express-validator');
const { catchValidationError } = require('../middlewares/validation-checker');
const { asyncWrapper } = require('../middlewares/async-wrapper');

router.post('/', 
  [body('unitId').notEmpty().isMongoId(), catchValidationError], 
  checkCurrentUser, 
  asyncWrapper(async (req, res) => {
    const userId = req.currentUser._id;
    const unitId = req.body.unitId;
    
    await bookmarkService.addBookmark(userId, unitId);

    res.status(201).json({ success: true });
  })
);

router.delete('/', 
  [body('unitId').notEmpty().isMongoId(), catchValidationError], 
  checkCurrentUser,
  asyncWrapper(async (req, res) => {
    const userId = req.currentUser._id;
    const unitId = req.body.unitId;

    await bookmarkService.deleteBookmark(userId, unitId);

    return res.status(200).json({ success: true });
  })
);

router.get('/counts/:unitId', 
  [param('unitId').notEmpty().isMongoId(), catchValidationError], 
  asyncWrapper(async (req, res) => {
    const unitId = req.params.unitId;

    const bookmarks = await bookmarkService.getBookmarksByUnit(unitId);

    res.status(200).json({ success: true, bookmarks });
  })
);

module.exports = router;