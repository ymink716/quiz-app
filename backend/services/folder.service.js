const { Folder } = require('../models/folder');
const { Unit } = require('../models/unit');
const createError = require('http-errors');
const { folderNotFound, forderForbidden } = require('../common/error-type').ErrorType;

exports.createFolder = async (title, description, userId) => {
  const newFolder = await Folder.create({
    title, description, maker: userId
  });

  return Folder.toResponseData(newFolder);
}

exports.getFoldersByUser = async (maker) => {
  const folders = await Folder.find({ maker });

  return Folder.toResponseDataList(folders);
}

exports.getFolder = async (folderId) => {
  const folder = await Folder.findById(folderId);

  if (!folder) {
    throw new createError(folderNotFound.statusCode, folderNotFound.message);
  }

  return Folder.toResponseData(folder);
}

exports.updateFolder = async (title, description, folderId, userId) => {
  await checkIsWriter(folderId, userId);

  const updatedFolder = await Folder.findByIdAndUpdate(
    folderId,
    { title, description },
    { new: true }
  );
    
  return Folder.toResponseData(updatedFolder);
}

exports.deleteFolder = async (folderId, userId) => {
  await checkIsWriter(folderId, userId);

  await Folder.findByIdAndDelete(folderId);
  await Unit.deleteMany({ folder });
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