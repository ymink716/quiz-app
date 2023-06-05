const express = require('express');
const router = express.Router();
const unitService = require('../service/unit.service');
const { checkCurrentUser } = require('../middlewares/auth.middleware');
const { body, param } = require('express-validator');
const { catchValidationError } = require('../middlewares/validation-checker.middleware');
const { asyncWrapper } = require('../middlewares/async-wrapper.middleware');

router.post('/', 
  [
    body('title').notEmpty().isString().isLength({ max: 50 }),
    body('description').isString().isLength({ max: 255 }),
    body('isPublic').notEmpty().isIn("public", "private"),
    body('words').isArray({ min: 0, max: 100 }),
    body('folderId').notEmpty().isMongoId(),
    catchValidationError,
  ], 
  checkCurrentUser, 
  asyncWrapper(async (req, res) => {
    const { title, description, isPublic, words, folderId } = req.body;
    const userId = req.currentUser._id;

    await unitService.createUnit(title, description, isPublic, words, folderId, userId);

    return res.status(201).json({ success: true });
  })
);

router.get('/',
  asyncWrapper(async (req, res) => {
    const units = await unitService.getPublicUnits();

    return res.status(200).json({ success: true, units });
  })
);

router.get('/:unitId', 
  [param('unitId').notEmpty().isMongoId(), catchValidationError], 
  asyncWrapper(async (req, res) => {
    const unitId = req.params.unitId;

    const unit = await unitService.getUnitById(unitId);

    return res.status(200).json({ success: true, unit });
  })
);

router.get('/search/:text', 
  [param('text').notEmpty().isString(), catchValidationError], 
  asyncWrapper(async (req, res) => {
    const text = req.params.text;

    const units = await unitService.getUnitsBySearchText(text);

    return res.status(200).json({ success: true, units });
  })
);

router.get('/folder/:folderId',
  [param('folderId').notEmpty().isMongoId(), catchValidationError], 
  asyncWrapper(async (req, res) => {
    const folderId = req.params.folderId;

    const units = await unitService.getUnitsByFolder(folderId);

    return res.status(200).json({ success: true, units });
  })
);

router.get('/bookmarks', 
  checkCurrentUser, 
  asyncWrapper(async (req, res) => {
    const userId = req.currentUser._id;

    const units = await unitService.getBookmarkedUnits(userId);

    return res.status(200).json({ success: true, units });
  })
);

router.put('/:unitId', 
  [
    body('title').notEmpty().isString().isLength({ max: 50 }),
    body('description').isString().isLength({ max: 255 }),
    body('words').isArray({ min: 0, max: 100 }),
    catchValidationError,
  ], 
  checkCurrentUser, 
  asyncWrapper(async (req, res) => {
    const { title, description, words } = req.body;
    const unitId = req.params.unitId;
    const userId = req.currentUser._id;

    const updatedUnit = await unitService.updateUnit(title, description, words, unitId, userId);

    return res.status(200).json({ success: true, updatedUnit });
  })
);

router.delete('/:unitId', 
  [param('unitId').notEmpty().isMongoId(), catchValidationError], 
  checkCurrentUser, 
  asyncWrapper(async (req, res) => {
    const unitId = req.params.unitId;
    const userId = req.currentUser._id;

    await unitService.deleteUnit(unitId, userId);

    res.status(200).json({ success: true });
  })
);

module.exports = router;