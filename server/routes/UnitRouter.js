const express = require('express');
const router = express.Router();
const unitController = require('../controllers/UnitController');
const { checkCurrentUser } = require('../middlewares/AuthMiddleware');

router.post('/', checkCurrentUser, unitController.createUnit);
router.get('/', unitController.getUnits);
router.get('/:unitId', unitController.getUnitById);
// 검색결과에 따른 get 추가
router.put('/:unitId', checkCurrentUser, unitController.updateUnit);
router.delete('/:unitId', checkCurrentUser, unitController.deleteUnit);


module.exports = router;