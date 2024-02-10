const express = require('express');
const { param, query, body } = require('express-validator');
const classController = require('../controllers/classroom.controller');

const router = express.Router();

router.get(
  '/class',
  query('page').optional(),
  query('size').optional(),
  classController.getAll
);

router.get(
  '/class/adminpanel/:id',
  param('id').isString().notEmpty(),
  classController.getById
);

router.post(
  '/class/adminpanel',
  body('name').isString().isLength({ min: 5, max: 128 }).notEmpty(),
  classController.createClass
);

router.put(
  '/class/adminpanel/:id',
  body('name').isString().isLength({ min: 5, max: 128 }).notEmpty(),
  param('id').isString().notEmpty(),
  classController.updateClass
);

router.delete(
  '/class/adminpanel/:id',
  param('id').isString().notEmpty(),
  classController.deleteClass
);

module.exports = router;
