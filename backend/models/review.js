const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  unitId: {
    type: Schema.Types.ObjectId,
    ref: 'Unit',
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  }
}, { 
  timestamps: true,
  versionKey: false,
});

reviewSchema.statics.toJSON = function(review) {
  const obj = review.toObject();

  delete obj.createdAt;
  delete obj.updatedAt;
  delete obj.userId;
  delete obj.unitId;

  return obj;
}

const Review = mongoose.model('Review', reviewSchema);

module.exports = { Review };