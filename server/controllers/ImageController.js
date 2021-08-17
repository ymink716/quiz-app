const { Review } = require('../models/review');
const { Bookmark } = require('../models/bookmark');
const { Unit } = require('../models/unit');
const s3 = require('../config/s3');

exports.uploadImage = async (req, res, next) => {
    try {
        const { title, description, isPublic, folderId } = req.body;

        if (!req.file.location)
            return res.status(400).json({ success: false, message: 'image does not exist' });

        const newImage = await Unit.create({
            title, description, isPublic, 
            imageURL: req.file.location, 
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

exports.deleteImage = async (req, res, next) => {
    try {
        const image = await Unit.findById(req.params.imageId).populate('maker');

        if (!image)
            return res.status(404).json({ success: false, message: 'Not Found.' });
        if (String(image.maker._id) !== String(req.currentUser._id))
            return res.status(403).json({ success: false, message: 'Forbidden.' });
        
        await Review.deleteMany({ unitId: req.params.imageId });
        await Bookmark.deleteMany({ unitId: req.params.imageId });
        const deletedImage = await Unit.findByIdAndDelete(req.params.imageId);
        
        const url = image.imageURL.split('/');
        const fileName = url[url.length - 1];
        s3.deleteObject({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileName
        }, function(err, data) {
            if (err) next(err);
            console.log('image delete success', data);
        });
        
        res.status(200).json({ success: true, deletedImage });
    } catch (error) {
        console.error(error);
        next(error);
    }
}