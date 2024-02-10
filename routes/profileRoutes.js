const express = require('express');
const { body, param } = require('express-validator');
const profileController = require('../controllers/userProfile.controller');

const router = express.Router();

router.put(
  '/profile/:id',
  param('id').isString().notEmpty(),
  body('name').isString().isLength({ max: 45 }),
  body('surname').isString().isLength({ max: 45 }),
  body('phone_number').isString().optional(),
  body('facebook_url').isString().optional(),
  body('avatar').isString().optional(),
  profileController.updateProfile
);

router.get('/profile/:id', profileController.getProfileById);

module.exports = router;
