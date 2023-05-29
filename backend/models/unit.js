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
        type: String,
        required: true,
    },
    words: {
        type: Array,
    },
    imageURL: {
        type: String,
    }
}, { 
    timestamps: true,
    versionKey: false,
});

unitSchema.statics.toResponseData = function(unit) {
    const obj = unit.toObject();
    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.maker.password;
    delete obj.maker.createdAt;
    delete obj.maker.updatedAt;
    
    return obj;
}

unitSchema.statics.toResponseDataList = function(units) {
    const array = [];

    for (const unit of units) {
        array.push(unit.toResponseData());
    }

    return array;
};

const Unit = mongoose.model('Unit', unitSchema);

module.exports = { Unit };