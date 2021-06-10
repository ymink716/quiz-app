const { Bookmark } = require('../models/bookmark');
const { Unit } = require('../models/unit');
const { User } = require('../models/user');
const ObjectId = require('mongoose').Types.ObjectId;

exports.addBookmark = async (req, res, next) => {
    try {
        const bookmark = await Bookmark.create({
            userId: req.currentUser._id,
            unitId: req.body.unitId,
        });

        res.status(201).json({ success: true, bookmark }); 
    } catch (error) {
        console.error(error);
        next(error);
    }
}
 
exports.deleteBookmark = async (req, res, next) => {
    try {
        const deletedBookmark = await Bookmark.findOneAndDelete({ 
            userId: new ObjectId(req.body.userId), 
            unitId: new ObjectId(req.body.unitId) 
        });
        
        res.status(200).json({ success: true, deletedBookmark });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.getBookmarksByUnit = async (req, res, next) => {
    try {
        const bookmarks = await Bookmark.find({ unitId: req.params.unitId });

        res.status(200).json({ success: true, bookmarks });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.getBookmarksByUser = async (req, res, next) => {
    try {
        const bookmarks = await Bookmark.find({ 
            userId: req.currentUser._id 
        }).populate('unitId');

        res.status(200).json({ success: true, bookmarks });
    } catch (error) {
        console.error(error);
        next(error);
    }
}