const { Folder } = require('../models/folder');
const { Unit } = require('../models/unit');
const createError = require('http-errors');
const { folderNotFound, forderForbidden } = require('../common/error-type').ErrorType;

exports.createFolder = async (req, res) => {
    const { title, description } = req.body;
    const userId = req.currentUser._id;

    const newFolder = await Folder.create({
        title, description, maker: userId
    });
    
    res.status(201).json({ 
        success: true,
        newFolder: Folder.toResponseData(newFolder),
    });
}

exports.getFoldersByUser = async (req, res) => {
    const maker = req.currentUser;

    const folders = await Folder.find({ maker });

    res.status(200).json({ 
        success: true, 
        folders: Folder.toResponseDataList(folders), 
    }); 
}

exports.getFolder = async (req, res) => {
    const folderId = req.params.folderId;

    let folder = await Folder.findById(folderId);

    if (!folder) {
        throw new createError(folderNotFound.statusCode, folderNotFound.message);
    }

    res.status(200).json({ 
        success: true, 
        folder: Folder.toResponseData(folder), 
    }); 
}

exports.updateFolder = async (req, res) => {
    const { title, description } = req.body;
    const folderId = req.params.folderId;
    const userId = req.currentUser._id;

    await checkIsWriter(folderId, userId);

    const updatedFolder = await Folder.findByIdAndUpdate(
        folderId,
        { title, description },
        { new: true }
    );
    
    res.status(200).json({ 
        success: true, 
        updatedFolder: Folder.toResponseData(updatedFolder), 
    });
}

exports.deleteFolder = async (req, res) => {
    const folderId = req.params.folderId;
    const userId = req.currentUser._id;

    await checkIsWriter(folderId, userId);

    await Folder.findByIdAndDelete(folderId);
    await Unit.deleteMany({ folder });

    res.status(200).json({ success: true });
}

const checkIsWriter = async (folderId, userId) => {
    const folder = await Folder.findById(folderId).populate('maker');

    if (!folder) {
        throw new createError(folderNotFound.statusCode, folderNotFound.message);
    }

    if (String(folder.maker._id) !== String(userId)) {
        throw new createError(forderForbidden.statusCode, forderForbidden.message);
    }
};