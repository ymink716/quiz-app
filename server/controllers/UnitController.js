const { Unit } = require('../models/unit');

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
        const units = await Unit.find({ isPublic: 'public' });
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
            return res.status(404).json({ success: false, message: '찾을 수 없습니다.' });

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
        ]);

        res.status(200).json({ success: true, units });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.updateUnit = async (req, res, next) => {
    try {
        const { title, description, isPublic, words } = req.body;
        const unit = await Unit.findById(req.params.unitId).populate('maker');

        if (!unit)
            return res.status(404).json({ success: false, message: '찾을 수 없습니다.' });
        if (toString(unit.maker._id) !== toString(req.currentUser._id))
            return res.status(403).json({ success: false, message: '제작자만 가능한 작업입니다.' });
        
        const updatedUnit = await Unit.findByIdAndUpdate(
            req.params.unitId,
            { title, description, isPublic, words }
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
            return res.status(404).json({ success: false, message: '찾을 수 없습니다.' });
        if (toString(unit.maker._id) !== toString(req.currentUser._id))
            return res.status(403).json({ success: false, message: '제작자만 가능한 작업입니다.' });
        
        const deletedUnit = await Unit.findByIdAndDelete(req.params.unitId);

        res.status(200).json({ success: true, deletedUnit });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

