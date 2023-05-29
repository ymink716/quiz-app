const { Folder } = require('../models/folder');
const { Unit } = require('../models/unit');

exports.createFolder = async (req, res, next) => {
    const { title, description } = req.body;
    const userId = req.currentUser._id;

    try {
        const newFolder = await Folder.create({
            title, description, maker: userId
        });
        
        res.status(201).json({ 
            success: true,
            newFolder: Folder.toResponseData(newFolder),
         });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.getFoldersByUser = async (req, res, next) => {
    const maker = req.currentUser;

    try {
        const folders = await Folder.find({ maker });

        res.status(200).json({ 
            success: true, 
            folders: Folder.toResponseDataList(folders), 
        }); 
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.getFolder = async (req, res, next) => {
    const folderId = req.params.folderId;

    try {
        let folder = await Folder.findById(folderId);

        if (!folder)
            return res.status(404).json({ success: false, message: 'Not Found.' });

        res.status(200).json({ 
            success: true, 
            folder: Folder.toResponseData(folder), 
        }); 
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.updateFolder = async (req, res, next) => {
    const { title, description } = req.body;
    const folderId = req.params.folderId;

    try {
        const folder = await Folder.findById(folderId).populate('maker');

        if (!folder)
            return res.status(404).json({ success: false, message: 'Not Found.' });
        if (String(folder.maker._id) !== String(req.currentUser._id))
            return res.status(403).json({ success: false, message: 'Forbidden.' });

        const updatedFolder = await Folder.findByIdAndUpdate(
            folderId,
            { title, description },
            { new: true }
        );
        
        res.status(200).json({ 
            success: true, 
            updatedFolder: Folder.toResponseData(updatedFolder), 
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.deleteFolder = async (req, res, next) => {
    const folderId = req.params.folderId;
    const userId = req.currentUser._id;

    try {
        const folder = await Folder.findById(folderId).populate('maker');
        
        if (!folder)
            return res.status(404).json({ success: false, message: 'Not Found.' });
        if (String(folder.maker._id) !== String(userId))
            return res.status(403).json({ success: false, message: 'Forbidden.' });
        
        await Folder.findByIdAndDelete(folderId);
        await Unit.deleteMany({ folder });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        next(error);
    }
}