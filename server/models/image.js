const mongoose = require('mongoose');
const { Schema } = mongoose;

const imageSchema = new Schema({
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
    imageURL: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const Image = mongoose.model('Image', imageSchema);

module.exports = { Image };