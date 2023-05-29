const { Bookmark } = require('../models/bookmark');
const { Unit } = require('../models/unit');
const ObjectId = require('mongoose').Types.ObjectId;

exports.addBookmark = async (req, res, next) => {
    const userId = req.currentUser._id;
    const unitId = req.body.unitId;

    try {
        await Bookmark.create({ userId, unitId });

        res.status(201).json({ success: true }); 
    } catch (error) {
        console.error(error);
        next(error);
    }
}
 
exports.deleteBookmark = async (req, res, next) => {
    const userId = req.currentUser._id;
    const unitId = req.body.unitId;

    try {
        const deletedBookmark = await Bookmark.findOneAndDelete({ 
            userId: new ObjectId(userId), 
            unitId: new ObjectId(unitId) 
        });

        if(!deletedBookmark)
            return res.status(404).json({ success: false, message: 'Not Found' });
        
        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.getBookmarksByUnit = async (req, res, next) => {
    const unitId = req.params.unitId;

    try {
        const bookmarks = await Bookmark.find({ unitId });

        res.status(200).json({ 
            success: true, 
            bookmarks: Bookmark.toResponseDataList(bookmarks); 
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
}