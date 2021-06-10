const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/BookmarkController');
const { checkCurrentUser } = require('../middlewares/AuthMiddleware');

router.post('/', checkCurrentUser, bookmarkController.addBookmark);
router.delete('/', checkCurrentUser, bookmarkController.deleteBookmark);
router.get('/counts/:unitId', bookmarkController.getBookmarksByUnit);
router.get('/users', checkCurrentUser, bookmarkController.getBookmarksByUser);

module.exports = router;