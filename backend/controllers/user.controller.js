const { User } = require('../models/user');
const { Bookmark } = require('../models/bookmark');
const { Review } = require('../models/review');
const { Unit } = require('../models/unit');
const { Folder } = require('../models/folder');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res, next) => {
    const { email, nickname, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({ message: 'This email is already in use.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        await User.create({ email, nickname, password: hash });

        res.status(201).json({ success: true });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.createToken = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user) {
            const result = await bcrypt.compare(password, user.password);
            
            if (!result) {
                return res.status(401).json({ message: 'Please check your ID and password again.'});
            }

            const token = jwt.sign({ email, userId: user._id }, process.env.JWT_SECRET_KEY);
            
            return res.status(200).json({ 
                success: true, 
                user: User.toResponseData(user), 
                token });
        } else {
            return res.status(401).json({ message: 'Please check your ID and password again.' });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.updateUser = async (req, res, next) => {
    const newPassword = req.body.newPassword || null;
    const currentPassword = req.body.currentPassword || null;
    const nickname = req.body.nickname || null;
    const userId = req.currentUser._id;

    try {
        if (newPassword) {
            const user = await User.findOne({ userId });

            const result = await bcrypt.compare(currentPassword, user.password);
            if (!result) return res.status(401).json({ success: false, message: 'Please check your password again.'});
                    
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
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.deleteUser = async (req, res, next) => {
    const password = req.body.password;
    const userId = req.currentUser._id;

    try {
        const user = await User.findOne({ userId });

        const result = await bcrypt.compare(password, user.password);
        if (!result) return res.status(401).json({ success: false, message: 'Please check your password again.'});
                
        await Bookmark.deleteMany({ userId });
        await Review.deleteMany({ userId });
        await Unit.deleteMany({ maker: userId });
        await Folder.deleteMany({ maker: userId });
        await User.findByIdAndDelete(userId);

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        next(error);
    }
}