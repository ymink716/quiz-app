const { Bookmark } = require('../models/bookmark');
const ObjectId = require('mongoose').Types.ObjectId;
const createError = require('http-errors');
const { reviewNotFound } = require('../common/error-type').ErrorType;

exports.addBookmark = async (req, res) => {
    const userId = req.currentUser._id;
    const unitId = req.body.unitId;

    await Bookmark.create({ userId, unitId });

    res.status(201).json({ success: true });
}

exports.deleteBookmark = async (req, res) => {
    const userId = req.currentUser._id;
    const unitId = req.body.unitId;

    const deletedBookmark = await Bookmark.findOneAndDelete({ 
        userId: new ObjectId(userId), 
        unitId: new ObjectId(unitId) 
    });

    if(!deletedBookmark)
        throw new createError(reviewNotFound.statusCode, reviewNotFound.message);
    
    res.status(200).json({ success: true });

}

exports.getBookmarksByUnit = async (req, res) => {
    const unitId = req.params.unitId;

    const bookmarks = await Bookmark.find({ unitId });

    res.status(200).json({ 
        success: true, 
        bookmarks: Bookmark.toResponseDataList(bookmarks),
    });
}