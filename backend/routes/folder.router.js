const express = require('express');
const router = express.Router();
const folderController = require('../controllers/FolderController');
const { checkCurrentUser } = require('../middlewares/auth.middleware');
const { body, param } = require('express-validator');
const { catchValidationError } = require('../middlewares/validation-checker.middleware');

router.post('/', [
    body('title').notEmpty().isString().isLength({ max: 50 }),
    body('description').isString().isLength({ max: 255 }),
    catchValidationError,
], checkCurrentUser, folderController.createFolder);

router.get('/myFolders', checkCurrentUser, folderController.getFoldersByUser);

router.get('/:folderId', checkCurrentUser, folderController.getFolder);

router.put('/:folderId', [
    body('title').notEmpty().isString().isLength({ max: 50 }),
    body('description').isString().isLength({ max: 255 }),
    catchValidationError,
], checkCurrentUser, folderController.updateFolder);

router.delete('/:folderId', checkCurrentUser, folderController.deleteFolder);

module.exports = router;