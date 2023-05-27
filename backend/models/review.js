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
}, { timestamps: true })


const Review = mongoose.model('Review', reviewSchema);

module.exports = { Review };