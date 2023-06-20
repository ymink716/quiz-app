const express = require('express');
const router = express.Router();

const users = require('./user.router');
const folders = require('./folder.router');
const units = require('./unit.router');
const images = require('./image.router');
const bookmarks = require('./bookmark.router');
const reviews = require('./review.router');

router.use('/users', users);
router.use('/folders', folders);
router.use('/units', units);
router.use('/images', images);
router.use('/bookmarks', bookmarks);
router.use('/reviews', reviews);

module.exports = router;