const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmark.controller');
const { checkCurrentUser } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');
const { catchValidationError } = require('../middlewares/validation-checker.middleware');

router.post('/', [
    body('unitId').notEmpty().isMongoId(),
    catchValidationError,
], checkCurrentUser, bookmarkController.addBookmark);

router.delete('/', [
    body('unitId').notEmpty().isMongoId(),
    catchValidationError,
], checkCurrentUser, bookmarkController.deleteBookmark);

router.get('/counts/:unitId', bookmarkController.getBookmarksByUnit);

module.exports = router;