const { Review } = require('../models/review');
const { Bookmark } = require('../models/bookmark');
const { Unit } = require('../models/unit');
const s3 = require('../config/s3');
const createError = require('http-errors');
const { imageBadRequest, imageNotFound, imageForbidden } = require('../common/error-type').ErrorType;

exports.uploadImage = async (req, res) => {
    const { title, description, isPublic, folderId } = req.body;
    const url = req.file.location;
    const userId = req.currentUser._id;

    if (!req.file.location) {
        throw new createError(imageBadRequest.statusCode, imageBadRequest.message);
    }

    await Unit.create({
        title, description, isPublic, 
        imageURL: url, 
        folder: folderId,
        type: "image", 
        maker: userId,
    });
    
    res.status(201).json({ success: true });
}

exports.deleteImage = async (req, res) => {
    const imageId = req.params.imageId;
    const userId = req.currentUser._id;

    await checkIsWriter(imageId, userId);
    
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
    });
    
    res.status(200).json({ success: true });
}

const checkIsWriter = async (imageId, userId) => {
    const image = await Unit.findById(imageId).populate('maker');

    if (!image) {
        throw new createError(imageNotFound.statusCode, imageNotFound.statusCode);
    }
    if (String(image.maker._id) !== String(userId)) {
        throw new createError(imageForbidden.statusCode, imageForbidden.message);
    }
}