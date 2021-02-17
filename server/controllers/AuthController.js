const { User } = require('../models/user');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res, next) => {
    const { email, nickname, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            res.status(409).json({ message: '이미 가입된 메일입니다.' });
        }

        const hash = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            email, nickname, password: hash
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        return next(error);
    }
}