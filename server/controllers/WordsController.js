const { Words } = require('../models/words');

exports.createWords = async (req, res, next) => {
    try {
        const { title, description, isPublic, wordList } = req.body;
        const newWords = await Words.create({
            title, description, isPublic, wordList, maker: req.currentUser._id,
        });

        res.status(201).json({ success: true, newWords });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.getWordsList = async (req, res, next) => {
    try {
        const wordsList = await Words.find();
        res.status(200).json({ success: true, wordsList });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.getWordsById = async (req, res, next) => {
    try {
        const words = await Words.findById(req.params.wordsId);

        if(!words)
            return res.status(404).json({ success: false, message: '해당 단어장을 찾을 수 없습니다.' });
        
        res.status(200).json({ success: true, words });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.updateWords = async (req, res, next) => {
    try {
        const { title, description, isPublic, wordList } = req.body;
        const words = await Words.findById(req.params.wordsId).populate('maker');

        if (!words)
            return res.status(404).json({ success: false, message: '해당 단어장을 찾을 수 없습니다.' });
        if (words.maker._id !== req.currentUser._id)
            return res.status(403).json({ success: false, message: '제작자만 가능한 작업입니다.' });
        
        const updatedWords = await Words.findByIdAndUpdate(
            req.params.wordsId,
            { title, description, isPublic, wordList }
        );

        res.status(200).json({ success: true, updatedWords });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.deleteWords = async (req, res, next) => {
    try {
        const words = await Words.findById(req.params.wordsId).populate('maker');

        if (!words)
            return res.status(404).json({ success: false, message: '해당 단어장을 찾을 수 없습니다.' });
        if (words.maker._id !== req.currentUser._id)
            return res.status(403).json({ success: false, message: '제작자만 가능한 작업입니다.' });
        
        const deletedWords = await Words.findByIdAndDelete(req.params.wordsId);

        res.status(200).json({ success: true, deletedWords });
    } catch (error) {
        console.error(error);
        next(error);
    }
}