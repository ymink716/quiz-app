const express =  require('express');
const dotenv = require('dotenv');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDatabase = require('./models');
require('express-async-errors');
const { HTTPError } = require('http-errors');

const app = express();
dotenv.config();
connectDatabase();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use('/api/users', require('./routes/user.router'));
app.use('/api/folders', require('./routes/folder.router'));
app.use('/api/units', require('./routes/unit.router'));
app.use('/api/images', require('./routes/image.router'));
app.use('/api/bookmarks', require('./routes/bookmark.router'));
app.use('/api/reviews', require('./routes/review.router'));

app.use((req, res, next) => {
    res.status(404).json({ message: 'Not Found' });
});

app.use((err, req, res, next) => {
    if (err instanceof HTTPError) {
        res.status(err.status).json({ message: err.message });
    } else {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
}); 

module.exports = { app };