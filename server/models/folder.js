const mongoose = require('mongoose');
const { Schema } = mongoose;

const folderSchema = new Schema({
    // 제목, 만든사람, 공개/비공개 
    title: {
        type: String,
        required: true,
    },
    maker: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    description: {
        type: String,
    },
    isPublic: {
        type: Boolean,
        required: true,
    }
}, { timestamps: true });

const Folder = mongoose.model('Folder', folderSchema);

module.exports = { Folder };