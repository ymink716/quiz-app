const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/BookmarkController');
const { checkCurrentUser } = require('../middlewares/AuthMiddleware');

router.post('/', checkCurrentUser, bookmarkController.addBookmark);
router.delete('/:bookmarkId', checkCurrentUser, bookmarkController.deleteBookmark);
router.get('/counts', bookmarkController.getBookmarkCounts);
router.get('/units', checkCurrentUser, bookmarkController.getBookmarkUnits);

module.exports = router;