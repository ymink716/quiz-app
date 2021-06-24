const { Review } = require('../models/review');
const ObjectId = require('mongoose').Types.ObjectId;

exports.saveReview = async (req, res, next) => {
    try {
        let review = await Review.findOne({ 
            userId: req.currentUser._id,
            unitId: req.body.unitId,
        });
        if (review) {
            review = await Review.findByIdAndUpdate(
                review._id,
                { rate: req.body.rate }
            );
        } else {
            review = await Review.create({
                userId: req.currentUser._id,
                rate: req.body.rate,
                unitId: req.body.unitId
            })
        }

        const reviews = await Review.find({ unitId: req.body.unitId });

        res.status(201).json({ success: true, review, reviews });
    } catch (error) {
        console.error(error);
        next(error);
    }
}
 
exports.getReviewsByUnit = async (req, res, next) => {
    try {
        const reviews = await Review.find({ unitId: req.params.unitId });

        res.status(200).json({ success: true, reviews });
    } catch (error) {
        console.error(error);
        next(error);
    }
}
