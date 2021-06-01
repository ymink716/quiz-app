const express = require('express');
const router = express.Router();
const unitController = require('../controllers/UnitController');
const { checkCurrentUser } = require('../middlewares/AuthMiddleware');

router.post('/', checkCurrentUser, unitController.createUnit);
router.get('/', unitController.getPublicUnits);
router.get('/:unitId', unitController.getUnitById);
router.get('/search/:text', unitController.getUnitsBySearchText);
router.put('/:unitId', checkCurrentUser, unitController.updateUnit);
router.delete('/:unitId', checkCurrentUser, unitController.deleteUnit);


module.exports = router;