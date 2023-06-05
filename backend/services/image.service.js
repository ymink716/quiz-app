const { Review } = require('../models/review');
const { Bookmark } = require('../models/bookmark');
const { Unit } = require('../models/unit');
const s3 = require('../config/s3');
const createError = require('http-errors');
const { imageBadRequest, imageNotFound, imageForbidden } = require('../common/error-type').ErrorType;

exports.uploadImage = async (title, description, isPublic, folderId, url, userId) => {
  if (!url) {
    throw new createError(imageBadRequest.statusCode, imageBadRequest.message);
  }

  await Unit.create({
    title, description, isPublic, 
    imageURL: url, 
    folder: folderId,
    type: "image", 
    maker: userId,
  });
}

exports.deleteImage = async (imageId, userId) => {
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