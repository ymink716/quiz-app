const { Review } = require('../models/review');

exports.saveReview = async (req, res) => {
    const userId = req.currentUser._id;
    const unitId = req.body.unitId;
    const rate = req.body.rate;

    const review = await Review.findOne({ userId, unitId });

    if (review) {
        await Review.findByIdAndUpdate(
            review._id,
            { rate },
            { new: true }
        );
    } else {
        await Review.create({ userId, rate, unitId });
    }

    const reviews = await Review.find({ unitId });

    res.status(201).json({ 
        success: true, 
        reviews: Review.toResponseDataList(reviews), 
    });
}
 
exports.getReviewsByUnit = async (req, res) => {
    const unitId = req.params.unitId;

    const reviews = await Review.find({ unitId });

    res.status(200).json({ 
        success: true, 
        reviews: Review.toResponseDataList(reviews), 
    });
}
