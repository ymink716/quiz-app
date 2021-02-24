const express = require('express');
const router = express.Router();
const folderController = require('../controllers/FolderController');

router.post('/', folderController.createFolder);
// router.get('/', folderController.getFolders);
// router.put('/', folderController.updateFloder);
// router.delete('/', folderController.deleteFolder);

module.exports = router;