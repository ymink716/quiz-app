const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    nickName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        minlength: 6,
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = { User };