const mongoose = require('mongoose');
const { Schema } = mongoose;
const { folderNotFound, folderForbidden } = require('../common/error-type').ErrorType;

const folderSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  maker: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  description: {
    type: String,
  }
}, { 
  timestamps: true,
  versionKey: false,
});

folderSchema.statics.checkIsWriter = async (folderId, userId) => {
  const folder = await Folder.findById(folderId).populate('maker');

  if (!folder) {
    throw new CustomError(folderNotFound.type, folderNotFound.status, folderNotFound.message);
  }

  if (String(folder.maker._id) !== String(userId)) {
    throw new CustomError(folderForbidden.type, folderForbidden.status, folderForbidden.message);
  }
};

const Folder = mongoose.model('Folder', folderSchema);

module.exports = { Folder };