const express = require('express');
const { body, param, query } = require('express-validator');
const commentController = require('../controllers/comment.controller');

const router = express.Router();

router.get(
  '/comment',
  query('page').optional(),
  query('size').optional(),
  commentController.getAll
);

router.get(
  '/comment/:id',
  param('id').isString().notEmpty(),
  commentController.getById
);

router.post(
  '/comment',
  body('recipentId').isString().notEmpty(),
  body('ratingNumber').isString().notEmpty(),
  body('content').isString().notEmpty(),
  commentController.createComment
);

router.delete(
  '/comment/:id',
  param('id').isString().notEmpty(),
  commentController.deleteComment
);

module.exports = router;
