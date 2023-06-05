const express = require('express');
const router = express.Router();

const users = require('./user.router');
const folders = require('./user.router');
const units = require('./user.router');
const images = require('./user.router');
const bookmarks = require('./user.router');
const reviews = require('./user.router');

app.use('/users', users);
app.use('/folders', folders);
app.use('/units', units);
app.use('/images', images);
app.use('/bookmarks', bookmarks);
app.use('/reviews', reviews);

module.exports = router;