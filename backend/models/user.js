const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    nickname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 10,
    },
    password: {
        type: String
    },
}, { 
    timestamps: true,
    versionKey: false,
});

userSchema.statics.toResponseData = function(user) {
    const obj = user.toObject();
    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.password;
    
    return obj;
}

const User = mongoose.model('User', userSchema);

module.exports = { User };