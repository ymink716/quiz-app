const { Unit } = require('../models/unit');
const { Review } = require('../models/review');
const { Bookmark } = require('../models/bookmark');
const createError = require('http-errors');
const { unitNotFound, unitForbidden } = require('../common/error-type').ErrorType;

exports.createUnit = async (title, description, isPublic, words, folderId, userId) => {
  await Unit.create({
    title, description, isPublic, words, 
    maker: userId, 
    folder: folderId,
    type: "words",
  });
}

exports.getPublicUnits = async () => {
  const units = await Unit.find({ isPublic: 'public' }).populate('maker');
    
  return Unit.toResponseDataList(units);
}

exports.getUnitById = async (unitId) => {
  const unit = await Unit.findById(unitId).populate('maker');

  if(!unit) {
    throw new createError(unitNotFound.statusCode, unitNotFound.message);
  }

  return Unit.toResponseData(unit);
}

exports.getUnitsBySearchText = async (text) => {
  const units = await Unit.find().and([
    { $or: [
      {'title' : new RegExp(text, 'i')},
      {'description' : new RegExp(text, 'i')}
    ]},
      { isPublic: 'public' }
    ]).populate('maker');

    return Unit.toResponseDataList(units);
}

exports.getUnitsByFolder = async (folderId) => {
  const units = await Unit.find({ folder: folderId }).populate('maker');

  return Unit.toResponseDataList(units);
}

exports.getBookmarkedUnits = async (userId) => {
  const bookmarks = await Bookmark.find({ userId });
    
  const unitIds = [];
  bookmarks.map((bookmark, index) => unitIds.push(bookmark.unitId)); 

  const units = await Unit.find({ _id: { $in: unitIds }}).populate('maker');

  return Unit.toResponseDataList(units);
}

exports.updateUnit = async (title, description, words, unitId, userId) => {
  await checkIsWriter(unitId, userId);
    
  const updatedUnit = await Unit.findByIdAndUpdate(
    unitId,
    { title, description, words },
    { new: true }
  );

  return Unit.toResponseData(updatedUnit);
}

exports.deleteUnit = async (unitId, userId) => {
  checkIsWriter(unitId, userId);
    
  await Review.deleteMany({ unitId });
  await Bookmark.deleteMany({ unitId });
  await Unit.findByIdAndDelete(unitId);
}

const checkIsWriter = async (unitId, userId) => {
  const unit = await Unit.findById(unitId).populate('maker');

  if (!unit) {
    throw new createError(unitNotFound.statusCode, unitNotFound.message);
  }
    
  if (String(unit.maker._id) !== String(userId)) {
    throw new createError(unitForbidden.statusCode, unitForbidden.message);
  }
}

