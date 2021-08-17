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
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = { User };