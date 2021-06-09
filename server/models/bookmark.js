const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookmarkSchema = mongoose.Schema({
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
}, { timestamps: true })


const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = { Bookmark };