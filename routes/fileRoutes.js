const express = require('express');
const fileController = require('../controllers/file.controller');

const router = express.Router();

router.post('/files/upload', fileController.upload);

router.get('/files', fileController.getListFiles);

router.get('/files/:name', fileController.download);

module.exports = router;
