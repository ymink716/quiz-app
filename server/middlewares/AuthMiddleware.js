const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

const checkCurrentUser = async (req, res, next) => {
    const token = req.headers["authorization"];   
    if (!token)
        return res.status(401).json({ success: false, message: 'No token provided' });
    
    try {
        const decoded = await jwt.verify(token, String(process.env.JWT_SECRET_KEY));
        const user = await User.findOne({ email: decoded.email });

        if (!user)
            return res.status(401).json({ success: false, message: 'Invalid token provided' });
        
        req.currentUser = user;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ success: false, message: 'Invalid token provided' });
    }
}

module.exports = { checkCurrentUser }