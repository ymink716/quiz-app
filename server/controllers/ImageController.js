const { Image } = require('../models/image');

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
        const newImage = await Image.create({
            title, description, isPublic, imageURL, folder: folderId, maker: req.currentUser._id,
        });
        
        res.status(201).json({ success: true, newImage });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.getImageById = async (req, res, next) => {
    try {
        const image = await Image.findById(req.params.imageId).populate('maker');

        if (!image)
            return res.status(404).json({ success: false, message: '해당 이미지를 찾을 수 없습니다.' });

        res.status(200).json({ success: true, image });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.deleteImage = async (req, res, next) => {
    try {
        const image = await Image.findById(req.params.imageId).populate('maker');
        
        if (!image)
            return res.status(404).json({ success: false, message: '해당 이미지를 찾을 수 없습니다.' });
        if (toString(image.maker._id) !== toString(req.currentUser._id))
            return res.status(403).json({ success: false, message: '제작자만 가능한 작업입니다.' });

        const deletedImage = await Image.findByIdAndDelete(req.params.imageId);

        res.status(200).json({ success: true, deletedImage });
        
    } catch (error) {
        console.error(error);
        next(error);
    }
}