const mongoose = require('mongoose');
const { Schema } = mongoose;

const wordsSchema = new Schema({
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
    },
    isPublic: {
        type: String,
        required: true,
    },
    wordList: {
        type: Array,
        required: true,
    }
}, { timestamps: true });

const Words = mongoose.model('Words', wordsSchema);

module.exports = { Words };