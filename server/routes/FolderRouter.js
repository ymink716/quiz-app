const express = require('express');
const router = express.Router();
const folderController = require('../controllers/FolderController');
const { checkCurrentUser } = require('../middlewares/AuthMiddleware');

router.post('/', checkCurrentUser, folderController.createFolder);
router.get('/myFolders', checkCurrentUser, folderController.getFoldersByUser)
router.get('/:folderId', checkCurrentUser, folderController.getFolder);
router.put('/:folderId', checkCurrentUser, folderController.updateFolder);
router.delete('/:folderId', checkCurrentUser, folderController.deleteFolder);

module.exports = router;