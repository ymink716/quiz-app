const { Unit } = require('../models/unit');
const { Review } = require('../models/review');
const { Bookmark } = require('../models/bookmark');
const CustomError = require('../common/error/custom-error');
const { unitNotFound } = require('../common/error-type').ErrorType;

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
    
  return units.map((unit) => Unit.toJSON(unit));
}

exports.getUnitById = async (unitId) => {
  const unit = await Unit.findById(unitId).populate('maker');

  if(!unit) {
    throw new CustomError(unitNotFound.type, unitNotFound.status, unitNotFound.message);
  }

  return Unit.toJSON(unit);
}

exports.getUnitsBySearchText = async (text) => {
  const units = await Unit.find().and([
    { $or: [
      {'title' : new RegExp(text, 'i')},
      {'description' : new RegExp(text, 'i')}
    ]},
      { isPublic: 'public' }
    ]).populate('maker');

    return units.map((unit) => Unit.toJSON(unit));
  }

exports.getUnitsByFolder = async (folderId) => {
  const units = await Unit.find({ folder: folderId }).populate('maker');

  return units.map((unit) => Unit.toJSON(unit));
}

exports.getBookmarkedUnits = async (userId) => {
  const bookmarks = await Bookmark.find({ userId });
    
  const unitIds = [];
  bookmarks.map((bookmark, index) => unitIds.push(bookmark.unitId)); 

  const units = await Unit.find({ _id: { $in: unitIds }}).populate('maker');

  return units.map((unit) => Unit.toJSON(unit));
}

exports.updateUnit = async (title, description, words, unitId, userId) => {
  await Unit.checkIsWriter(unitId, userId);
    
  const updatedUnit = await Unit.findByIdAndUpdate(
    unitId,
    { title, description, words },
    { new: true }
  );

  return Unit.toJSON(updatedUnit);
}

exports.deleteUnit = async (unitId, userId) => {
  Unit.checkIsWriter(unitId, userId);
    
  await Review.deleteMany({ unitId });
  await Bookmark.deleteMany({ unitId });
  await Unit.findByIdAndDelete(unitId);
}