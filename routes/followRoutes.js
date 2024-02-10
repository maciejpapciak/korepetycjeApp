const express = require('express');
const { param } = require('express-validator');
const followController = require('../controllers/follow.controller');

const router = express.Router();

router.get('/follow', followController.getFollowers);

router.post(
  '/follow/:id',
  param('id').isString().notEmpty(),
  followController.createFollow
);

router.delete(
  '/follow/:id',
  param('id').isString().notEmpty(),
  followController.deleteFollow
);

module.exports = router;
