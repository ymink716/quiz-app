const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res, next) => {
    const { email, nickname, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({ message: '이미 가입된 메일입니다.' });
        }

        const hash = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            email, nickname, password: hash
        });

        res.status(201).json({ success: true, newUser });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.createToken = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user) {
            const result = await bcrypt.compare(password, user.password);
            if (!result) {
                return res.status(401).json({ message: '아이디와 비밀번호를 다시 확인해주세요.'});
            }       
            const token = jwt.sign({ email, userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
            return res.status(200).json({ success: true, user, token });
        } else {
            return res.status(401).json({ message: '아이디와 비밀번호를 다시 확인해주세요.'});
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}