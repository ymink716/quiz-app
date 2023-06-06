const { Review } = require('../models/review');

exports.saveReview = async (userId, unitId, rate) => {
  const review = await Review.findOne({ userId, unitId });

  if (review) {
    await Review.findByIdAndUpdate(review._id, { rate });
  } else {
    await Review.create({ userId, rate, unitId });
  }

  const reviews = await Review.find({ unitId });

  return reviews.map((review) => Review.toJSON(review));
}
 
exports.getReviewsByUnit = async (unitId) => {
  const reviews = await Review.find({ unitId });

  return reviews.map((review) => Review.toJSON(review));
}
