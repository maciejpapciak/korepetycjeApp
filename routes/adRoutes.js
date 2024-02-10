const express = require('express');
const { body, param, query } = require('express-validator');
const authController = require('../controllers/auth.controller');
const adController = require('../controllers/advertisement.controller');

const router = express.Router();

router.use(authController.protect);

router.get(
  '/ads',
  query('page').optional(),
  query('size').optional(),
  adController.getAll
);

router.get(
  '/adsfiltered',
  query('page').optional(),
  query('size').optional(),
  query('type').optional(),
  query('after').optional(),
  adController.getAllFiltered
);

router.get(
  '/adsfilter',
  query('page').optional(),
  query('size').optional(),
  query('type').optional(),
  query('after').optional(),
  query('classId').optional(),
  adController.getAllFilteredByClass
);

router.get(
  '/adminpanel',
  query('page').optional(),
  query('size').optional(),
  query('status').isString().notEmpty(),
  adController.getAllByStatus
);

// TODO: rename
router.get(
  '/ads/placeholder',
  query('page').optional(),
  query('size').optional(),
  query('type').isString().notEmpty(),
  adController.getAllByType
);

router.get('/ads/:id', param('id').isString().notEmpty(), adController.getById);

router.post(
  '/ads',
  body('title').isString().isLength({ min: 5, max: 255 }).notEmpty(),
  body('content').isString().isLength({ min: 5, max: 4096 }).notEmpty(),
  body('price').isString().notEmpty(),
  body('classId').isString().notEmpty(),
  body('typeId').isFloat({ min: 1, max: 2 }).notEmpty(),
  adController.createAd
);

router.put(
  '/ads/:id',
  param('id').isString().notEmpty(),
  body('title').isString().isLength({ min: 5, max: 255 }).notEmpty(),
  body('content').isString().isLength({ min: 5, max: 4096 }).notEmpty(),
  body('price').isString().notEmpty(),
  body('classId').isString().notEmpty(),
  body('typeId').isFloat({ min: 1, max: 2 }).notEmpty(),
  adController.updateAd
);

router.put(
  '/adminpanel/accept/:id',
  param('id').isString().notEmpty(),
  adController.acceptAd
);

router.delete(
  '/deletead/:id',
  param('id').isString().notEmpty(),
  adController.deleteAd
);

module.exports = router;
