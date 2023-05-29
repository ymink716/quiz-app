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
}, { 
    timestamps: true,
    versionKey: false,
});

folderSchema.statics.toResponseData = function(folder) {
    const obj = folder.toObject();
    delete obj.maker;
    delete obj.createdAt;
    delete obj.updatedAt;

    return obj;
}

folderSchema.statics.toResponseDataList = function(folders) {
    const array = [];

    for (const folder of folders) {
        array.push(folder.toResponseData());
    }

    return array;
};

const Folder = mongoose.model('Folder', folderSchema);

module.exports = { Folder };