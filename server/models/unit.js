const mongoose = require('mongoose');
const { Schema } = mongoose;

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
        type: Stirng,
        required: true,
    },
    words: {
        type: Array,
    },
    imageURL: {
        type: String,
    }
}, { timestamps: true });

const Unit = mongoose.model('Unit', unitSchema);

module.exports = { Unit };