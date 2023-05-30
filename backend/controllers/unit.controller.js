const { Unit } = require('../models/unit');
const { Review } = require('../models/review');
const { Bookmark } = require('../models/bookmark');
const createError = require('http-errors');
const { unitNotFound, unitForbidden } = require('../common/error-type').ErrorType;

exports.createUnit = async (req, res) => {
    const { title, description, isPublic, words, folderId } = req.body;
    const userId = req.currentUser._id;

    await Unit.create({
        title, description, isPublic, words, 
        maker: userId, 
        folder: folderId,
        type: "words",
    });

    res.status(201).json({ success: true });
}

exports.getPublicUnits = async (req, res) => {
    const units = await Unit.find({ isPublic: 'public' }).populate('maker');
        
    res.status(200).json({ 
        success: true, 
        units: Unit.toResponseDataList(units), 
    });
}

exports.getUnitById = async (req, res) => {
    const unitId = req.params.unitId;

    const unit = await Unit.findById(unitId).populate('maker');

    if(!unit) {
        throw new createError(unitNotFound.statusCode, unitNotFound.message);
    }

    res.status(200).json({ 
        success: true, 
        unit: Unit.toResponseData(unit), 
    });
}

exports.getUnitsBySearchText = async (req, res) => {
    const text = req.params.text;

    const units = await Unit.find().and([
        { $or: [
            {'title' : new RegExp(text, 'i')},
            {'description' : new RegExp(text, 'i')}
        ]},
        { isPublic: 'public' }
    ]).populate('maker');

    res.status(200).json({ 
        success: true, 
        units: Unit.toResponseDataList(units), 
    });
}

exports.getUnitsByFolder = async (req, res) => {
    const folderId = req.params.folderId;

    const units = await Unit.find({ folder: folderId }).populate('maker');

    res.status(200).json({
        success: true,
        units: Unit.toResponseDataList(units),
    });
}

// TODO: 북마크한 유닛들 가져오기 구현
exports.getBookmarkedUnit = async (req, res) => {
    const userId = req.currentUser._id;

    const bookmarks = await Bookmark.find({ userId });
    
    let unitIds = [];
    bookmarks.map((bookmark, index) => unitIds.push(bookmark.unitId)); 

    const units = await Unit.find({ _id: { $in: unitIds }}).populate('maker');

    res.status(200).json({ success: true, bookmarks, units });
}

exports.updateUnit = async (req, res) => {
    const { title, description, words } = req.body;
    const unitId = req.params.unitId;
    const userId = req.currentUser._id;

    await checkIsWriter(unitId, userId);
    
    const updatedUnit = await Unit.findByIdAndUpdate(
        unitId,
        { title, description, words },
        { new: true }
    );

    res.status(200).json({ 
        success: true, 
        updatedUnit: Unit.toResponseData(updatedUnit), 
    });
}

exports.deleteUnit = async (req, res) => {
    const unitId = req.params.unitId;
    const userId = req.currentUser._id;

    checkIsWriter(unitId, userId);
    
    await Review.deleteMany({ unitId });
    await Bookmark.deleteMany({ unitId });
    await Unit.findByIdAndDelete(unitId);

    res.status(200).json({ success: true });
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

