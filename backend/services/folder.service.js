const { Folder } = require('../models/folder');
const { Unit } = require('../models/unit');
const CustomError = require('../common/error/custom-error');
const { folderNotFound } = require('../common/error-type').ErrorType;

exports.createFolder = async (title, description, userId) => {
  const newFolder = await Folder.create({
    title, description, maker: userId
  });

  return newFolder;
}

exports.getFoldersByUser = async (maker) => {
  const folders = await Folder.find({ maker }).select(['-maker', 'createdAt', '-updatedAt']);

  return folders;
}

exports.getFolder = async (folderId) => {
  const folder = await Folder.findById(folderId);

  if (!folder) {
    throw new CustomError(folderNotFound.type, folderNotFound.status, folderNotFound.message);
  }

  return folder;
}

exports.updateFolder = async (title, description, folderId, userId) => {
  await Folder.checkIsWriter(folderId, userId);

  const updatedFolder = await Folder.findByIdAndUpdate(
    folderId,
    { title, description },
    { new: true }
  );
    
  return updatedFolder;
}

// TODO: 폴더 삭제 -> 유닛 삭제 -> 리뷰, 북마크도 삭제
exports.deleteFolder = async (folderId, userId) => {
  await Folder.checkIsWriter(folderId, userId);
  
  const folder = await Folder.findByIdAndDelete(folderId);
  
  await Unit.deleteMany({ folder });
  // await Review.deleteMany({ unitId });
  // await Bookmark.deleteMany({ unitId });
}