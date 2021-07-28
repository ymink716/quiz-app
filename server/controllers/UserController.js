const { User } = require('../models/user');
const { Bookmark } = require('../models/bookmark');
const { Review } = require('../models/review');
const { Unit } = require('../models/unit');
const { Folder } = require('../models/folder');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res, next) => {
    try {
        const { email, nickname, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({ message: 'This email is already in use.' });
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
                return res.status(401).json({ message: 'Please check your ID and password again.'});
            }       
            const token = jwt.sign({ email, userId: user._id }, process.env.JWT_SECRET_KEY);
            return res.status(200).json({ success: true, user, token });
        } else {
            return res.status(401).json({ message: 'Please check your ID and password again.' });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        if (req.body.newPassword) {
            const result = await bcrypt.compare(req.body.currentPassword, req.currentUser.password);
            if (!result) return res.status(401).json({ success: false, message: 'Please check your password again.'});
                    
            const hash = await bcrypt.hash(req.body.newPassword, 12);
            const user = await User.findOneAndUpdate(
                { _id: req.currentUser._id },
                { password: hash }, 
                { new: true }
            );
            res.status(200).json({ success: true, user });
        } else {
            const user = await User.findOneAndUpdate(
                { _id: req.currentUser._id },
                { nickname: req.body.nickname }, 
                { new: true }
            );
            res.status(200).json({ success: true, user });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const result = await bcrypt.compare(req.body.password, req.currentUser.password);
        if (!result) return res.status(401).json({ success: false, message: 'Please check your password again.'});
                
        await Bookmark.deleteMany({ userId: req.currentUser._id });
        await Review.deleteMany({ userId: req.currentUser._id });
        await Unit.deleteMany({ maker: req.currentUser._id });
        await Folder.deleteMany({ maker: req.currentUser._id });
        const user = await User.findByIdAndDelete(req.currentUser._id);

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error(error);
        next(error);
    }
}