const express = require('express');
const router = express.Router();
const folderService = require('../services/folder.service');
const { checkCurrentUser } = require('../middlewares/auth.middleware');
const { body, param } = require('express-validator');
const { catchValidationError } = require('../middlewares/validation-checker.middleware');
const { asyncWrapper } = require('../middlewares/async-wrapper.middleware');

router.post('/', 
  [
    body('title').notEmpty().isString().isLength({ max: 50 }),
    body('description').isString().isLength({ max: 255 }),
    catchValidationError
  ], 
  checkCurrentUser,
  asyncWrapper(async (req, res) => {
    const { title, description } = req.body;
    const userId = req.currentUser._id;

    const newFolder = await folderService.createFolder(title, description, userId);

    res.status(201).json({ success: true, newFolder });
  })
);

router.get('/myFolders', 
  checkCurrentUser,
  asyncWrapper(async (req, res) => {
    const maker = req.currentUser;

    const folders = await folderService.getFoldersByUser(maker);

    res.status(200).json({ success: true, folders }); 
  })
);

router.get('/:folderId', 
  checkCurrentUser, 
  asyncWrapper(async (req, res) => {
    const folderId = req.params.folderId;

    const folder = await folderService.getFolder(folderId);

    res.status(200).json({ success: true, folder }); 
  })
);

router.put('/:folderId', 
  [
    body('title').notEmpty().isString().isLength({ max: 50 }),
    body('description').isString().isLength({ max: 255 }),
    body('folderId').notEmpty().isMongoId(), 
    catchValidationError,
  ], 
  checkCurrentUser, 
  asyncWrapper(async (req, res) => {
    const { title, description } = req.body;
    const folderId = req.params.folderId;
    const userId = req.currentUser._id;

    const updatedFolder = await folderService.updateFolder(title, description, folderId, userId);

    res.status(200).json({ success: true, updatedFolder });
  })
);

router.delete('/:folderId', 
  [param('folderId').notEmpty().isMongoId(), catchValidationError], 
  checkCurrentUser,
  asyncWrapper(async (req, res) => {
    const folderId = req.params.folderId;
    const userId = req.currentUser._id;

    await folderService.deleteFolder(folderId, userId);

    res.status(200).json({ success: true });
  })
);

module.exports = router;