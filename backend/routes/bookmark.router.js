const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/BookmarkController');
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

router.get('/users', checkCurrentUser, bookmarkController.getBookmarksByUser);

module.exports = router;