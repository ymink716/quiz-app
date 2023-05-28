const mongoose = require('mongoose');
const { Schema } = mongoose;

const folderSchema = new Schema({
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
    }
}, { timestamps: true });

const Folder = mongoose.model('Folder', folderSchema);

module.exports = { Folder };