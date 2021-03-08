const express = require('express');
const router = express.Router();
const wordsController = require('../controllers/WordsController');
const { checkCurrentUser } = require('../middlewares/AuthMiddleware');

router.post('/', checkCurrentUser, wordsController.createWords);
router.get('/', wordsController.getWordsList);
router.get('/:wordsId', wordsController.getWordsById);
// 검색결과에 따른 get 추가
router.put('/:wordsId', checkCurrentUser, wordsController.updateWords);
router.delete('/:wordsid', checkCurrentUser, wordsController.deleteWords);

module.exports = router;