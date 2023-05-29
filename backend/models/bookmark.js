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
}, { 
    timestamps: true,  
    versionKey: false,
});

bookmarkSchema.statics.toResponseData = function(bookmark) {
    const obj = bookmark.toObject();
    delete obj.createdAt;
    delete obj.updatedAt;

    return obj;
}

bookmarkSchema.statics.toResponseDataList = function(bookmarkList) {
    const array = [];

    for (const bookmark of bookmarkList) {
        array.push(bookmark.toResponseData());
    }

    return array;
};


const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = { Bookmark };