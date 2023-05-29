const express = require('express');
const router = express.Router();
const unitController = require('../controllers/unit.controller');
const { checkCurrentUser } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');
const { catchValidationError } = require('../middlewares/validation-checker.middleware');

router.post('/', [
    body('title').notEmpty().isString().isLength({ max: 50 }),
    body('description').isString().isLength({ max: 255 }),
    body('isPublic').notEmpty().isIn("public", "private"),
    body('words').isArray({ min: 0, max: 100 }),
    body('folderId').notEmpty().isMongoId(),
    catchValidationError,
], checkCurrentUser, unitController.createUnit);

router.get('/', unitController.getPublicUnits);

router.get('/:unitId', unitController.getUnitById);

// TODO: query validation
router.get('/search/:text', unitController.getUnitsBySearchText);

// TODO: 폴더 안 유닛

// TODO: 북마크한 유닛
router.get('/users', checkCurrentUser, bookmarkController.getBookmarksByUser);

router.put('/:unitId', [
    body('title').notEmpty().isString().isLength({ max: 50 }),
    body('description').isString().isLength({ max: 255 }),
    body('words').isArray({ min: 0, max: 100 }),
    catchValidationError,
], checkCurrentUser, unitController.updateUnit);

router.delete('/:unitId', checkCurrentUser, unitController.deleteUnit);

module.exports = router;