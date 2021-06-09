const { Bookmark } = require('../models/bookmark');
const { Unit } = require('../models/unit');
const { User } = require('../models/user');

exports.addBookmark = async (req, res, next) => {
    try {
        const unit = await Unit.findById(req.body.unitId);
        if (toString(req.currentUser._id === unit.maker._id))
            return res.status(403).json({ success: false, message: '작성자는 북마크 할 수 없습니다.' });

        const bookmark = await Bookmark.create({
            userId: req.currentUser._id,
            unitId: req.body.unitId,
        });

        res.status(201).json({ success: true, bookmark }); 
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.deleteBookmark = async (req, res, next) => {
    try {
        const bookmark = await Bookmark.findById(req.params.bookmarkId);
        if (toString(req.currentUser._id) !== toString(bookmark.userId))
            return res.status(403).json({ success: false, message: '해당 권한이 없는 사용자입니다.' });
            
        const deletedBookmark = await Bookmark.deleteOne(req.params.bookmarkId);
        
        res.status(200).json({ success: true, deletedBookmark });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.getBookmarkCounts = async (req, res, next) => {
    try {
        const bookmarks = await Bookmark.find({ unitId: req.params.unitId });

        res.status(200).json({ success: true, counts: bookmarks.length });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.getBookmarkUnits = async (req, res, next) => {
    try {
        const units = await Bookmark.find({ userId: req.currentUser._id });

        res.status(200).json({ success: true, units });
    } catch (error) {
        console.error(error);
        next(error);
    }
}