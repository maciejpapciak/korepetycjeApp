const express = require('express');
const rankingController = require('../controllers/ranking.controller');

const router = express.Router();

router.get('/rankings', rankingController.getRanking);

module.exports = router;
