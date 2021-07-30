const { Unit } = require('../models/unit');
const { Review } = require('../models/review');
const { Bookmark } = require('../models/bookmark');

exports.createUnit = async (req, res, next) => {
    try {
        const { title, description, isPublic, words, folderId } = req.body;
        const newUnit = await Unit.create({
            title, description, isPublic, words, 
            maker: req.currentUser._id, 
            folder: folderId,
            type: "words",
        });

        res.status(201).json({ success: true, newUnit });
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

        res.status(200).json({ success: true, unit });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.getUnitsBySearchText = async (req, res, next) => {
    try {
        const text = req.params.text;
        const units = await Unit.find().and([
            { $or: [
                {'title' : new RegExp(text, 'i')},
                {'description' : new RegExp(text, 'i')}
            ]},
            { isPublic: 'public' }
        ]).populate('maker');

        res.status(200).json({ success: true, units });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.updateUnit = async (req, res, next) => {
    try {
        const { title, description, words } = req.body;
        const unit = await Unit.findById(req.params.unitId).populate('maker');

        if (!unit)
            return res.status(404).json({ success: false, message: 'Not Found' });
        if (String(unit.maker._id) !== String(req.currentUser._id))
            return res.status(403).json({ success: false, message: 'Forbidden' });
        
        const updatedUnit = await Unit.findByIdAndUpdate(
            req.params.unitId,
            { title, description, words },
            { new: true }
        );

        res.status(200).json({ success: true, updatedUnit });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.deleteUnit = async (req, res, next) => {
    try {
        const unit = await Unit.findById(req.params.unitId).populate('maker');

        if (!unit)
            return res.status(404).json({ success: false, message: 'Not Found.' });
        if (String(unit.maker._id) !== String(req.currentUser._id))
            return res.status(403).json({ success: false, message: 'Forbidden.' });
        
        await Review.deleteMany({ unitId: req.params.unitId });
        await Bookmark.deleteMany({ unitId: req.params.unitId });
        const deletedUnit = await Unit.findByIdAndDelete(req.params.unitId);

        res.status(200).json({ success: true, deletedUnit });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

