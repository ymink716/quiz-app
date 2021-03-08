const { Folder } = require('../models/folder');

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

exports.getFolder = async (req, res, next) => {
    try {
        const folder = await Folder.findById(req.params.folderId);

        if (!folder)
            return res.status(404).json({ success: false, message: '해당 폴더를 찾을 수 없습니다.' });

        res.status(200).json({ success: true, folder }); 
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

exports.updateFolder = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const folder = await Folder.findById(req.params.folderId).populate('maker');

        if (!folder)
            return res.status(404).json({ success: false, message: '해당 폴더를 찾을 수 없습니다.' });
        if (folder.maker._id !== req.currentUser._id)
            return res.status(403).json({ success: false, message: '제작자만 가능한 작업입니다.' });

        const updatedFolder = await Folder.findByIdAndUpdate(
            req.params.folderId,
            { title, description }
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
            return res.status(404).json({ success: false, message: '해당 폴더를 찾을 수 없습니다.' });
        if (folder.maker._id !== req.currentUser._id)
            return res.status(403).json({ success: false, message: '제작자만 가능한 작업입니다.' });
        
        const deletedFolder = await Folder.findByIdAndDelete(req.params.folderId);
        
        res.status(200).json({ success: true, deletedFolder });
    } catch (error) {
        console.error(error);
        next(error);
    }
}