const { User } = require('../models/user');
const { Bookmark } = require('../models/bookmark');
const { Review } = require('../models/review');
const { Unit } = require('../models/unit');
const { Folder } = require('../models/folder');
const createError = require('http-errors');
const { existedUser, userBadRequest } = require('../common/error-type').ErrorType;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
    const { email, nickname, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
        throw new createError(existedUser.statusCode, existedUser.message);
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await User.create({ email, nickname, password: hash });

    res.status(201).json({ success: true });
}

exports.createToken = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
        const result = await bcrypt.compare(password, user.password);
        
        if (!result) {
            throw new createError(userBadRequest.statusCode, userBadRequest.message);
        }

        const token = jwt.sign({ email, userId: user._id }, process.env.JWT_SECRET_KEY);
        
        return res.status(200).json({ 
            success: true, 
            user: User.toResponseData(user), 
            token 
        });
    } else {
        throw new createError(userBadRequest.statusCode, userBadRequest.message);
    }
}

exports.updateUser = async (req, res) => {
    const newPassword = req.body.newPassword || null;
    const currentPassword = req.body.currentPassword || null;
    const nickname = req.body.nickname || null;
    const userId = req.currentUser._id;

    if (newPassword) {
        const user = await User.findOne({ userId });

        const result = await bcrypt.compare(currentPassword, user.password);
        
        if (!result) {
            throw new createError(userBadRequest.statusCode, userBadRequest.message);
        }

        const hash = await bcrypt.hash(newPassword, 10);
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { password: hash }, 
            { new: true }
        );
        res.status(200).json({ 
            success: true, 
            user: User.toResponseData(updatedUser), 
        });
    } else {
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { nickname }, 
            { new: true }
        );
        res.status(200).json({ 
            success: true, 
            user: User.toResponseData(updatedUser) 
        });
    }
}

exports.deleteUser = async (req, res) => {
    const password = req.body.password;
    const userId = req.currentUser._id;

    const user = await User.findOne({ userId });

    const result = await bcrypt.compare(password, user.password);
    
    if (!result) {
        throw new createError(userBadRequest.statusCode, userBadRequest.message);
    } 
            
    await Bookmark.deleteMany({ userId });
    await Review.deleteMany({ userId });
    await Unit.deleteMany({ maker: userId });
    await Folder.deleteMany({ maker: userId });
    await User.findByIdAndDelete(userId);

    res.status(200).json({ success: true });
}