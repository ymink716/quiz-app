const mongoose = require('mongoose');
const { Schema } = mongoose;
const CustomError = require('../common/error/custom-error');
const { unitNotFound, unitForbidden } = require('../common/error-type').ErrorType;

const unitSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  maker: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  folder: {
    type: Schema.Types.ObjectId,
    ref: 'Folder',
  },
  description: {
    type: String,
  },
  isPublic: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  words: {
    type: Array,
  },
  imageURL: {
    type: String,
  }
}, { 
  timestamps: true,
  versionKey: false,
});

unitSchema.statics.toJSON = function(unit) {
  const obj = unit.toObject();
  
  delete obj.createdAt;
  delete obj.updatedAt;
  delete obj.maker.password;
  delete obj.maker.createdAt;
  delete obj.maker.updatedAt;
    
  return obj;
}

unitSchema.statics.checkIsWriter = async (unitId, userId) => {
  const unit = await Unit.findById(unitId).populate('maker');
  
  if (!unit) {
    throw new CustomError(unitNotFound.type, unitNotFound.status, unitNotFound.message);
  }
      
  if (String(unit.maker._id) !== String(userId)) {
    throw new CustomError(unitForbidden.type, unitForbidden.status, unitForbidden.message);
  }
}

const Unit = mongoose.model('Unit', unitSchema);

module.exports = { Unit };