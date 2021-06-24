const { User } = require('../models/user');
const { Bookmark } = require('../models/bookmark');
const { Review } = require('../models/review');
const { Unit } = require('../models/unit');
const { Folder } = require('../models/folder');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res, next) => {
    const { email, nickname, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({ message: '이미 가입된 메일입니다.' });
        }

        const hash = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            email, nickname, password: hash
        });

        res.status(201).json({ success: true, newUser });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.createToken = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user) {
            const result = await bcrypt.compare(password, user.password);
            if (!result) {
                return res.status(401).json({ message: '아이디와 비밀번호를 다시 확인해주세요.'});
            }       
            const token = jwt.sign({ email, userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
            return res.status(200).json({ success: true, user, token });
        } else {
            return res.status(401).json({ message: '아이디와 비밀번호를 다시 확인해주세요.'});
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.updateProfile = async (req, res, next) => {
    try {
        let updatedUser;
        if (req.body.newPassword) {
            const hash = await bcrypt.hash(req.body.newPassword, 12);
            updatedUser = await User.findOneAndUpdate({ password: hash });
        } else {
            updateduser = await User.findOneAndUpdate({ email: req.body.email, nickname: req.body.email });
        }

        res.status(200).json({ success: true, updatedUser });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const deletedBookmark = await Bookmark.deleteMany({ userId: req.createUser._id });
        const deletedReview = await Review.deleteMany({ userId: req.createUser._id });
        const deletedUnit = await Unit.deleteMany({ maker: req.createUser._id });
        const deletedFolder = await Folder.deleteMany({ maker: req.createUser._id });
        const deletedUser = await User.findOneAndDelete(req.createUser._id);

        res.status(200).json({ success: true, deletedUser });
    } catch (error) {
        console.error(error);
        next(error);
    }
}