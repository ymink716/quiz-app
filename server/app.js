const express =  require('express');
const dotenv = require('dotenv');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require("mongoose");

const app = express();

dotenv.config();

// DB 연결 
mongoose.connect(process.env.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true,
    useCreateIndex: true, useFindAndModify: false
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// 미들웨어
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// 라우터
app.use('/api/auth', require('./routes/AuthRouter'));
app.use('/api/folder', require('./routes/FolderRouter'));
app.use('/api/unit', require('./routes/UnitRouter'));
app.use('/api/upload', require('./routes/UploadRouter'));

app.use((req, res, next) => {
    res.status(404).json({ message: 'Not Found' });
});

app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});

module.exports = { app };