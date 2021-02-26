const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

const checkCurrentUser = async (req, res, next) => {
    try {
        const token = req.headers["authorization"];

        if (!token)
            return res.status(401).json({ message: 'token이 전달되지 않았습니다.' });

        const decoded = await jwt.verify(token, String(process.env.JWT_SECRET_KEY));
        const user = await User.findById(decoded.userId);

        if (!user)
            return res.status(404).json({ message: '해당 사용자를 찾을 수 없습니다.' });
        
        req.currentUser = user;
        next();
    } catch (error) {
        console.error(error);
        next(error);
    }
}

module.exports = { checkCurrentUser }