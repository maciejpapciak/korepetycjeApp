const express = require('express');
const AppError = require('../utils/appError');

const router = express.Router();

router.use('*', (req, res, next) => {
  next(new AppError(404, 'fail', 'undefined route'), req, res, next);
});

module.exports = router;
