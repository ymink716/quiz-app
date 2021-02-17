const { User } = require('../models/user');
const bcrypt = require('bcrypt');

exports.createUser = (req, res, next) => {
    const { email, nickName, password } = req.body;
    try {
        const user = await User.findOne({ emeil });
        if (user) {
            res.status(409).json({ message: '이미 가입된 메일입니다.' });
        }

        const hash = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            email, nickName, password: hash
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        return next(error);
    }
}