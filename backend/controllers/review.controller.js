const { Review } = require('../models/review');

exports.saveReview = async (req, res, next) => {
    const userId = req.currentUser._id;
    const unitId = req.body.unitId;
    const rate = req.body.rate;

    try {
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
    } catch (error) {
        console.error(error);
        next(error);
    }
}
 
exports.getReviewsByUnit = async (req, res, next) => {
    const unitId = req.params.unitId;

    try {
        const reviews = await Review.find({ unitId });

        res.status(200).json({ 
            success: true, 
            reviews: Review.toResponseDataList(reviews), 
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
}
