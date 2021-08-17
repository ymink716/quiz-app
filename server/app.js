const express =  require('express');
const dotenv = require('dotenv');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connect = require('./models');
const path = require('path');

const app = express();
dotenv.config();
connect();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use('/api/user', require('./routes/UserRouter'));
app.use('/api/folder', require('./routes/FolderRouter'));
app.use('/api/unit', require('./routes/UnitRouter'));
app.use('/api/image', require('./routes/ImageRouter'));
app.use('/api/bookmark', require('./routes/BookmarkRouter'));
app.use('/api/review', require('./routes/ReviewRouter'));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static("client/build"));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client/build/index.html"));
    });
}

app.use((req, res, next) => {
    res.status(404).json({ message: 'Not Found' });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: err.message });
});

module.exports = { app };