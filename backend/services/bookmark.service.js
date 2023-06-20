const { Bookmark } = require('../models/bookmark');
const ObjectId = require('mongoose').Types.ObjectId;
const CustomError = require('../common/errors/custom-error');
const { bookmarkNotFound } = require('../common/errors/error-type').ErrorType;

exports.addBookmark = async (userId, unitId) => {
  await Bookmark.create({ userId, unitId });
}

exports.deleteBookmark = async (userId, unitId) => {
  const deletedBookmark = await Bookmark.findOneAndDelete({ 
    userId: new ObjectId(userId), 
    unitId: new ObjectId(unitId), 
  });
  
  if(!deletedBookmark) {
    throw new CustomError(bookmarkNotFound.type, bookmarkNotFound.status, bookmarkNotFound.message);
  }
}

exports.getBookmarksByUnit = async (unitId) => {
  const bookmarks = await Bookmark.find({ unitId }).select(['-createdAt', '-updatedAt']);
  
  return bookmarks;
}