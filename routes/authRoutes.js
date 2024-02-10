const express = require('express');
const { body, param } = require('express-validator');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post(
  '/auth/login',
  body('email').optional(),
  body('nickname').optional(),
  body('password').isString().notEmpty(),
  authController.login
);

router.post(
  '/auth/register',
  body('name').isString().notEmpty(),
  body('surname').isString().notEmpty(),
  body('email').normalizeEmail().isEmail(),
  body('nickname').isString().notEmpty(),
  body('password').isString().notEmpty(),
  body('userType').notEmpty().not().equals('1'),
  authController.register
);

router.get(
  '/auth/confirmation/:email/:token',
  param('email').normalizeEmail().isEmail(),
  param('token').isString().notEmpty(),
  authController.confirmEmail
);

module.exports = router;
