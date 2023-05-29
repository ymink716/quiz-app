const { Unit } = require('../models/unit');
const { Review } = require('../models/review');
const { Bookmark } = require('../models/bookmark');

exports.createUnit = async (req, res, next) => {
    const { title, description, isPublic, words, folderId } = req.body;
    const userId = req.currentUser._id;

    try {
        await Unit.create({
            title, description, isPublic, words, 
            maker: userId, 
            folder: folderId,
            type: "words",
        });

        res.status(201).json({ success: true });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.getPublicUnits = async (req, res, next) => {
    try {
        const units = await Unit.find({ isPublic: 'public' }).populate('maker');
        
        res.status(200).json({ success: true, units });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.getUnitById = async (req, res, next) => {
    try {
        const unit = await Unit.findById(req.params.unitId).populate('maker');

        if(!unit)
            return res.status(404).json({ success: false, message: 'can not find unit.' });

        res.status(200).json({ 
            success: true, 
            unit: Unit.toResponseData(unit), 
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.getUnitsBySearchText = async (req, res, next) => {
    const text = req.params.text;

    try {
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
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.getUnitsByFolder = async (req, res, next) => {
    const folderId = req.params.folderId;

    try {
        const units = await Unit.find({ folder: folderId }).populate('maker');

        res.status(200).json({
            success: true,
            units: Unit.toResponseDataList(units),
        })
    } catch (error) {
        console.error(error);
        next(error);
    }
}

// TODO: 북마크한 유닛들 가져오기 구현
exports.getBookmarkedUnit = async (req, res, next) => {
    const userId = req.currentUser._id;

    try {
        const bookmarks = await Bookmark.find({ userId });
        
        let unitIds = [];
        bookmarks.map((bookmark, index) => unitIds.push(bookmark.unitId)); 

        const units = await Unit.find({ _id: { $in: unitIds }}).populate('maker');

        res.status(200).json({ success: true, bookmarks, units });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.updateUnit = async (req, res, next) => {
    const { title, description, words } = req.body;
    const unitId = req.params.unitId;
    const userId = req.currentUser._id;

    try {
        const unit = await Unit.findById(unitId).populate('maker');

        if (!unit)
            return res.status(404).json({ success: false, message: 'Not Found' });
        if (String(unit.maker._id) !== String(userId))
            return res.status(403).json({ success: false, message: 'Forbidden' });
        
        const updatedUnit = await Unit.findByIdAndUpdate(
            unitId,
            { title, description, words },
            { new: true }
        );

        res.status(200).json({ 
            success: true, 
            updatedUnit: Unit.toResponseData(updatedUnit), 
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.deleteUnit = async (req, res, next) => {
    const unitId = req.params.unitId;
    const userId = req.currentUser._id;

    try {
        const unit = await Unit.findById(unitId).populate('maker');

        if (!unit)
            return res.status(404).json({ success: false, message: 'Not Found.' });
        if (String(unit.maker._id) !== String(userId))
            return res.status(403).json({ success: false, message: 'Forbidden.' });
        
        await Review.deleteMany({ unitId });
        await Bookmark.deleteMany({ unitId });
        await Unit.findByIdAndDelete(unitId);

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

