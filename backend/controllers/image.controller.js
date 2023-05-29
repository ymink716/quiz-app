const { Review } = require('../models/review');
const { Bookmark } = require('../models/bookmark');
const { Unit } = require('../models/unit');
const s3 = require('../config/s3');

exports.uploadImage = async (req, res, next) => {
    const { title, description, isPublic, folderId } = req.body;
    const url = req.file.location;
    const userId = req.currentUser._id;

    try {
        if (!req.file.location)
            return res.status(400).json({ success: false, message: 'image does not exist' });

        await Unit.create({
            title, description, isPublic, 
            imageURL: url, 
            folder: folderId,
            type: "image", 
            maker: userId,
        });
        
        res.status(201).json({ success: true });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.deleteImage = async (req, res, next) => {
    const imageId = req.params.imageId;
    const userId = req.currentUser._id;

    try {
        const image = await Unit.findById(imageId).populate('maker');

        if (!image)
            return res.status(404).json({ success: false, message: 'Not Found.' });
        if (String(image.maker._id) !== String(userId))
            return res.status(403).json({ success: false, message: 'Forbidden.' });
        
        await Review.deleteMany({ unitId: imageId });
        await Bookmark.deleteMany({ unitId: imageId });
        await Unit.findByIdAndDelete(imageId);
        
        const url = image.imageURL.split('/');
        const fileName = url[url.length - 1];

        s3.deleteObject({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileName
        }, function(err, data) {
            if (err) next(err);
            console.log('image delete success', data);
        });
        
        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        next(error);
    }
}