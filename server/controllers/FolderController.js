const { Folder } = require('../models/folder');
const { Unit } = require('../models/unit');

exports.createFolder = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const newFolder = await Folder.create({
            title, description, maker: req.currentUser._id
        });

        res.status(201).json({ success: true, newFolder });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.getFoldersByUser = async (req, res, next) => {
    try {
        const folders = await Folder.find({ maker: req.currentUser });
        res.status(200).json({ success: true, folders }); 
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.getFolder = async (req, res, next) => {
    try {
        const folder = await Folder.findById(req.params.folderId);

        if (!folder)
            return res.status(404).json({ success: false, message: 'Not Found.' });

        const units = await Unit.find({ folder: req.params.folderId }).populate('maker');

        res.status(200).json({ success: true, folder, units }); 
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.updateFolder = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const folder = await Folder.findById(req.params.folderId).populate('maker');

        if (!folder)
            return res.status(404).json({ success: false, message: 'Not Found.' });
        if (String(folder.maker._id) !== String(req.currentUser._id))
            return res.status(403).json({ success: false, message: 'Forbidden.' });

        const updatedFolder = await Folder.findByIdAndUpdate(
            req.params.folderId,
            { title, description },
            { new: true }
        );
        
        res.status(200).json({ success: true, updatedFolder });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.deleteFolder = async (req, res, next) => {
    try {
        const folder = await Folder.findById(req.params.folderId).populate('maker');
        
        if (!folder)
            return res.status(404).json({ success: false, message: 'Not Found.' });
        if (String(folder.maker._id) !== String(req.currentUser._id))
            return res.status(403).json({ success: false, message: 'Forbidden.' });
        
        const deletedFolder = await Folder.findByIdAndDelete(req.params.folderId);
        const deletedUnits = await Unit.deleteMany({ folder });

        res.status(200).json({ success: true, deletedFolder, deletedUnits });
    } catch (error) {
        console.error(error);
        next(error);
    }
}