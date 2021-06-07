const { Unit } = require('../models/unit');

exports.uploadImage = (req, res, next) => {
    try {
        return res.status(201).json({ 
            success: true, 
            image: req.file.path, 
            fileName: req.file.filename 
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.createImage = async (req, res, next) => {
    try {
        const { title, description, isPublic, imageURL, folderId } = req.body;
        const newImage = await Unit.create({
            title, description, isPublic, imageURL, 
            folder: folderId,
            type: "image", 
            maker: req.currentUser._id,
        });
        
        res.status(201).json({ success: true, newImage });
    } catch (error) {
        console.error(error);
        next(error);
    }
}