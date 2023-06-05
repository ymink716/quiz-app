const { Bookmark } = require('../models/bookmark');
const ObjectId = require('mongoose').Types.ObjectId;
const createError = require('http-errors');
const { reviewNotFound } = require('../common/error/error-type').ErrorType;

exports.addBookmark = async (userId, unitId) => {
    await Bookmark.create({ userId, unitId });
}

exports.deleteBookmark = async (userId, unitId) => {
    const deletedBookmark = await Bookmark.findOneAndDelete({ 
        userId: new ObjectId(userId), 
        unitId: new ObjectId(unitId) 
    });

    if(!deletedBookmark) {
        throw new createError(reviewNotFound.statusCode, reviewNotFound.message);
    }
}

exports.getBookmarksByUnit = async (unitId) => {
    const bookmarks = await Bookmark.find({ unitId });

    return Bookmark.toResponseDataList(bookmarks);
}